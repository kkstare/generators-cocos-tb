var window = $global;

const inputManager = $global.cc.internal.inputManager;
const renderer = $global.cc.renderer;
const game = $global.cc.game;
let _frameRate = 60;

Object.assign(game, {
    setFrameRate (frameRate) {
        _frameRate = frameRate;
        if ($global.__globalAdapter.setPreferredFramesPerSecond) {
            $global.__globalAdapter.setPreferredFramesPerSecond(frameRate);
        }
        else {
            this._paused = true;
            this._setAnimFrame();
        }
    },

    getFrameRate () {
        return _frameRate;
    },
});

//  Small game in the screen log
function onErrorMessageHandler (info) {
    // off error event
    $global.__globalAdapter.offError && $global.__globalAdapter.offError(onErrorMessageHandler);

    var allowTrigger = Math.random() < 0.001;
    if ($global.__globalAdapter.isSubContext || !allowTrigger) {
        return;
    }

    var env = $global.__globalAdapter.getSystemInfoSync();
    if (!env) {
        return;
    }
    var root = $global.cc.Canvas.instance.node;
    if (!root) {
        return;
    }

    var offset = 60;
    var node = new $global.cc.Node();
    node.color = $global.cc.Color.BLACK;
    node.parent = root;

    var label = node.addComponent($global.cc.Label);
    node.height = root.height - offset;
    node.width = root.width - offset;
    label.overflow = $global.cc.Label.Overflow.SHRINK;
    label.horizontalAlign = $global.cc.Label.HorizontalAlign.LEFT;
    label.verticalAlign = $global.cc.Label.VerticalAlign.TOP;
    label.fontSize = 24;

    if ($global.cc.LabelOutline) {
        var outline = node.addComponent($global.cc.LabelOutline);
        outline.color = $global.cc.Color.WHITE;
    }

    label.string = '请截屏发送以下信息反馈给游戏开发者（Please send this screen shot to the game developer）\n';
    label.string += 'Device: ' + env.brand + ' ' + env.model + '\n' + 'System: ' + env.system + '\n' + 'Platform: WeChat ' + env.version + '\n' + 'Engine: Cocos Creator v' + window.CocosEngine + '\n' + 'Error:\n' + info.message;

    $global.cc.director.pause();

    node.once('touchend', function () {
        node.destroy();
        setTimeout(function () {
            $global.cc.director.resume();
        }, 1000)
    })
}

$global.__globalAdapter.onError && $global.__globalAdapter.onError(onErrorMessageHandler);
