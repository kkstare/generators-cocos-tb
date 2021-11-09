var window = $global;

const inputManager = $global.cc.internal.inputManager;
const renderer = $global.cc.renderer;
const game = $global.cc.game;
const dynamicAtlasManager = $global.cc.dynamicAtlasManager;

let originRun = game.run;
Object.assign(game, {
    _banRunningMainLoop: $global.__globalAdapter.isSubContext,
    _firstSceneLaunched: false,

    run () {
        $global.cc.director.once($global.cc.Director.EVENT_AFTER_SCENE_LAUNCH, () => {
            this._firstSceneLaunched = true;
        });
        originRun.apply(this, arguments);
    },
    
    setFrameRate (frameRate) {
        this.config.frameRate = frameRate;
        if ($global.__globalAdapter.setPreferredFramesPerSecond) {
            $global.__globalAdapter.setPreferredFramesPerSecond(frameRate);
        }
        else {
            if (this._intervalId) {
                window.cancelAnimFrame(this._intervalId);
            }
            this._intervalId = 0;
            this._paused = true;
            this._setAnimFrame();
            this._runMainLoop();
        }
    },

    _runMainLoop () {
        if (this._banRunningMainLoop) {
            return;
        }
        var self = this, callback, config = self.config,
            director = $global.cc.director,
            skip = true, frameRate = config.frameRate;

        $global.cc.debug.setDisplayStats(config.showFPS);

        callback = function () {
            if (!self._paused) {
                self._intervalId = window.requestAnimFrame(callback);
                if (frameRate === 30  && !$global.__globalAdapter.setPreferredFramesPerSecond) {
                    skip = !skip;
                    if (skip) {
                        return;
                    }
                }
                director.mainLoop();
            }
        };

        self._intervalId = window.requestAnimFrame(callback);
        self._paused = false;
    },

    _initRenderer () {
        // Avoid setup to be called twice.
        if (this._rendererInitialized) return;

        // frame and container are useless on minigame platform
        let sys = $global.cc.sys;
        if (sys.platform === sys.TAOBAO) {
            this.frame = this.container = window.document.createElement("DIV");
        } else {
            this.frame = this.container = $global.document.createElement("DIV");
        }

        let localCanvas;
        if ($global.__globalAdapter.isSubContext) {
            localCanvas = window.sharedCanvas || $global.__globalAdapter.getSharedCanvas();
        }
        else if (sys.platform === sys.TAOBAO) {
            localCanvas = window.canvas;
        }
        else {
            localCanvas = $global.canvas;
        }
        this.canvas = localCanvas;

        this._determineRenderType();
        // WebGL context created successfully
        if (this.renderType === this.RENDER_TYPE_WEBGL) {
            var opts = {
                'stencil': true,
                // MSAA is causing serious performance dropdown on some browsers.
                'antialias': $global.cc.macro.ENABLE_WEBGL_ANTIALIAS,
                'alpha': $global.cc.macro.ENABLE_TRANSPARENT_CANVAS,
                'preserveDrawingBuffer': false,
            };
            renderer.initWebGL(localCanvas, opts);
            this._renderContext = renderer.device._gl;

            // Enable dynamic atlas manager by default
            if (!$global.cc.macro.CLEANUP_IMAGE_CACHE && dynamicAtlasManager) {
                dynamicAtlasManager.enabled = true;
            }
        }
        if (!this._renderContext) {
            this.renderType = this.RENDER_TYPE_CANVAS;
            // Could be ignored by module settings
            renderer.initCanvas(localCanvas);
            this._renderContext = renderer.device._ctx;
        }

        this._rendererInitialized = true;
    },

    _initEvents () {
        // register system events
        if (this.config.registerSystemEvent) {
            inputManager.registerSystemEvent(this.canvas);
        }

        var hidden = false;

        function onHidden() {
            if (!hidden) {
                hidden = true;
                game.emit(game.EVENT_HIDE);
            }
        }

        function onShown(res) {
            if (hidden) {
                hidden = false;
                if (game.renderType === game.RENDER_TYPE_WEBGL) {
                    game._renderContext.finish();
                }                
                game.emit(game.EVENT_SHOW, res);
            }
        }
        
        $global.__globalAdapter.onAudioInterruptionEnd && $global.__globalAdapter.onAudioInterruptionEnd(function () {
            if ($global.cc.audioEngine) $global.cc.audioEngine._restore();
            
        });
        $global.__globalAdapter.onAudioInterruptionBegin && $global.__globalAdapter.onAudioInterruptionBegin(function () {
            if ($global.cc.audioEngine) $global.cc.audioEngine._break();
        });

        // Maybe not support in open data context
        $global.__globalAdapter.onShow && $global.__globalAdapter.onShow(onShown);
        $global.__globalAdapter.onHide && $global.__globalAdapter.onHide(onHidden);

        this.on(game.EVENT_HIDE, function () {
            game.pause();
        });
        this.on(game.EVENT_SHOW, function () {
            game.resume();
        });
    },

    end () { },  // mini game platform not support this api
});
