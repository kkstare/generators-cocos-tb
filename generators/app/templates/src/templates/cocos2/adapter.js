/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./templates/cocos2-adapter-modified/common/cache-manager.js":
/*!*******************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/cache-manager.js ***!
  \*******************************************************************/
/***/ ((module) => {

var window = $global;

/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of cache-manager software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in cache-manager License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const { getUserDataPath, readJsonSync, makeDirSync, writeFileSync, copyFile, downloadFile, writeFile, deleteFile, rmdirSync, unzip, isOutOfStorage } = window.fsUtils;

var checkNextPeriod = false;
var writeCacheFileList = null;
var startWrite = false;
var nextCallbacks = [];
var callbacks = [];
var cleaning = false;
var suffix = 0;
const REGEX = /^https?:\/\/.*/;

var cacheManager = {

    cacheDir: 'gamecaches',

    cachedFileName: 'cacheList.json',

    // whether or not cache asset into user's storage space
    cacheEnabled: true,

    // whether or not auto clear cache when storage ran out
    autoClear: true,

    // cache one per cycle
    cacheInterval: 500,

    deleteInterval: 500,

    writeFileInterval: 2000,

    // whether or not storage space has run out
    outOfStorage: false,

    tempFiles: null,

    cachedFiles: null,

    cacheQueue: {},

    version: '1.0',

    getCache (url) {
        return this.cachedFiles.has(url) ? this.cachedFiles.get(url).url : '';
    },

    getTemp (url) {
        return this.tempFiles.has(url) ? this.tempFiles.get(url) : '';
    },

    init () {
        this.cacheDir = getUserDataPath() + '/' + this.cacheDir;
        var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
        var result = readJsonSync(cacheFilePath);
        if (result instanceof Error || !result.version) {
            if (!(result instanceof Error)) rmdirSync(this.cacheDir, true);
            this.cachedFiles = new $global.cc.AssetManager.Cache();
            makeDirSync(this.cacheDir, true);
            writeFileSync(cacheFilePath, JSON.stringify({ files: this.cachedFiles._map, version: this.version }), 'utf8');
        }
        else {
            this.cachedFiles = new $global.cc.AssetManager.Cache(result.files);
        }
        this.tempFiles = new $global.cc.AssetManager.Cache();
    },

    updateLastTime (url) {
        if (this.cachedFiles.has(url)) {
            var cache = this.cachedFiles.get(url);
            cache.lastTime = Date.now();
        }
    },

    _write () {
        writeCacheFileList = null;
        startWrite = true;
        writeFile(this.cacheDir + '/' + this.cachedFileName, JSON.stringify({ files: this.cachedFiles._map, version: this.version }), 'utf8', function () {
            startWrite = false;
            for (let i = 0, j = callbacks.length; i < j; i++) {
                callbacks[i]();
            }
            callbacks.length = 0;
            callbacks.push.apply(callbacks, nextCallbacks);
            nextCallbacks.length = 0;
        });
    },

    writeCacheFile (cb) {
        if (!writeCacheFileList) {
            writeCacheFileList = setTimeout(this._write.bind(this), this.writeFileInterval);
            if (startWrite === true) {
                cb && nextCallbacks.push(cb);
            }
            else {
                cb && callbacks.push(cb);
            }
        } else {
            cb && callbacks.push(cb);
        }
    },

    _cache () {
        var self = this;
        for (var id in this.cacheQueue) {
            var { srcUrl, isCopy, cacheBundleRoot } = this.cacheQueue[id];
            var time = Date.now().toString();

            var localPath = '';

            if (cacheBundleRoot) {
                localPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${suffix++}${$global.cc.path.extname(id)}`;
            }
            else {
                localPath = `${this.cacheDir}/${time}${suffix++}${$global.cc.path.extname(id)}`;
            }
             
            function callback (err) {
                checkNextPeriod = false;
                if (err)  {
                    if (isOutOfStorage(err.message)) {
                        self.outOfStorage = true;
                        self.autoClear && self.clearLRU();
                        return;
                    }
                } else {
                    self.cachedFiles.add(id, { bundle: cacheBundleRoot, url: localPath, lastTime: time });
                    delete self.cacheQueue[id];
                    self.writeCacheFile();
                }
                if (!$global.cc.js.isEmptyObject(self.cacheQueue)) {
                    checkNextPeriod = true;
                    setTimeout(self._cache.bind(self), self.cacheInterval);
                }
            }
            if (!isCopy) {
                downloadFile(srcUrl, localPath, null, callback);
            }
            else {
                copyFile(srcUrl, localPath, callback);
            }
            return;
        }
        checkNextPeriod = false;
    },

    cacheFile (id, srcUrl, cacheEnabled, cacheBundleRoot, isCopy) {
        cacheEnabled = cacheEnabled !== undefined ? cacheEnabled : this.cacheEnabled;
        if (!cacheEnabled || this.cacheQueue[id] || this.cachedFiles.has(id)) return;

        this.cacheQueue[id] = { srcUrl, cacheBundleRoot, isCopy };
        if (!checkNextPeriod) {
            checkNextPeriod = true;
            if (!this.outOfStorage) {
                setTimeout(this._cache.bind(this), this.cacheInterval);
            }
            else {
                checkNextPeriod = false;
            }
        }
    },

    clearCache () {
        rmdirSync(this.cacheDir, true);
        this.cachedFiles = new $global.cc.AssetManager.Cache();
        makeDirSync(this.cacheDir, true);
        var cacheFilePath = this.cacheDir + '/' + this.cachedFileName;
        this.outOfStorage = false;
        writeFileSync(cacheFilePath, JSON.stringify({ files: this.cachedFiles._map, version: this.version }), 'utf8');
        $global.cc.assetManager.bundles.forEach(bundle => {
            if (REGEX.test(bundle.base)) this.makeBundleFolder(bundle.name);
        });
    },

    clearLRU () {
        if (cleaning) return;
        cleaning = true;
        var caches = [];
        var self = this;
        this.cachedFiles.forEach(function (val, key) {
            if (val.bundle === 'internal') return;
            if (self._isZipFile(key) && $global.cc.assetManager.bundles.find(bundle => bundle.base.indexOf(val.url) !== -1)) return;
            caches.push({ originUrl: key, url: val.url, lastTime: val.lastTime });
        });
        caches.sort(function (a, b) {
            return a.lastTime - b.lastTime;
        });
        caches.length = Math.floor(caches.length / 3);
        if (caches.length === 0) return;
        for (var i = 0, l = caches.length; i < l; i++) {
            this.cachedFiles.remove(caches[i].originUrl);
        }
        
        this.writeCacheFile(function () {
            function deferredDelete () {
                var item = caches.pop();
                if (self._isZipFile(item.originUrl)) {
                    rmdirSync(item.url, true);
                    self._deleteFileCB();
                }
                else {
                    deleteFile(item.url, self._deleteFileCB.bind(self));
                }
                if (caches.length > 0) { 
                    setTimeout(deferredDelete, self.deleteInterval); 
                }
                else {
                    cleaning = false;
                }
            }
            setTimeout(deferredDelete, self.deleteInterval);
        });

    },

    removeCache (url) {
        if (this.cachedFiles.has(url)) {
            var self = this;
            var path = this.cachedFiles.remove(url).url;
            this.writeCacheFile(function () {
                if (self._isZipFile(url)) {
                    rmdirSync(path, true);
                    self._deleteFileCB();
                }
                else {
                    deleteFile(path, self._deleteFileCB.bind(self));
                }
            });
        }
    },

    _deleteFileCB (err) {
        if (!err) this.outOfStorage = false;
    },

    makeBundleFolder (bundleName) {
        makeDirSync(this.cacheDir + '/' + bundleName, true);
    },

    unzipAndCacheBundle (id, zipFilePath, cacheBundleRoot, onComplete) {
        let time = Date.now().toString();
        let targetPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${suffix++}`;
        let self = this;
        makeDirSync(targetPath, true);
        unzip(zipFilePath, targetPath, function (err) {
            if (err) {
                rmdirSync(targetPath, true);
                if (isOutOfStorage(err.message)) {
                    self.outOfStorage = true;
                    self.autoClear && self.clearLRU();
                }
                onComplete && onComplete(err);
                return;
            }
            self.cachedFiles.add(id, { bundle: cacheBundleRoot, url: targetPath, lastTime: time });
            self.writeCacheFile();
            onComplete && onComplete(null, targetPath);
        });
    },

    _isZipFile (url) {
        return url.slice(-4) === '.zip';
    },
};

$global.cc.assetManager.cacheManager = module.exports = cacheManager;

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/AssetManager.js":
/*!*************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/AssetManager.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var window = $global;

const cacheManager = __webpack_require__(/*! ../cache-manager */ "./templates/cocos2-adapter-modified/common/cache-manager.js");
const { fs, downloadFile, readText, readArrayBuffer, readJson, loadSubpackage, getUserDataPath, exists } = window.fsUtils;

const REGEX = /^https?:\/\/.*/;
const cachedSubpackageList = {};
const downloader = $global.cc.assetManager.downloader;
const parser = $global.cc.assetManager.parser;
const presets = $global.cc.assetManager.presets;
const isSubDomain = $global.__globalAdapter.isSubContext;
downloader.maxConcurrency = 8;
downloader.maxRequestsPerFrame = 64;
presets['scene'].maxConcurrency = 10;
presets['scene'].maxRequestsPerFrame = 64;

let SUBCONTEXT_ROOT, REMOTE_SERVER_ROOT;
let subpackages = {}, remoteBundles = {};

function downloadScript(url, options, onComplete) {
    if (typeof options === 'function') {
        onComplete = options;
        options = null;
    }
    if (REGEX.test(url)) {
        onComplete && onComplete(new Error('Can not load remote scripts'));
    }
    else {
        onComplete && onComplete(null, $global.__cocos_require__(url));
    }
}

function handleZip(url, options, onComplete) {
    let cachedUnzip = cacheManager.cachedFiles.get(url);
    if (cachedUnzip) {
        cacheManager.updateLastTime(url);
        onComplete && onComplete(null, cachedUnzip.url);
    }
    else if (REGEX.test(url)) {
        downloadFile(url, null, options.header, options.onFileProgress, function (err, downloadedZipPath) {
            if (err) {
                onComplete && onComplete(err);
                return;
            }
            cacheManager.unzipAndCacheBundle(url, downloadedZipPath, options.__cacheBundleRoot__, onComplete);
        });
    }
    else {
        cacheManager.unzipAndCacheBundle(url, url, options.__cacheBundleRoot__, onComplete);
    }
}

function downloadDomAudio(url, options, onComplete) {
    if (typeof options === 'function') {
        onComplete = options;
        options = null;
    }

    let dom;
    let sys = $global.cc.sys;
    if (sys.platform === sys.TAOBAO) {
        dom = window.document.createElement('audio');
    } else {
        dom = $global.document.createElement('audio');
    }
    dom.src = url;

    // HACK: wechat does not callback when load large number of assets
    onComplete && onComplete(null, dom);
}

function download(url, func, options, onFileProgress, onComplete) {
    var result = transformUrl(url, options);
    if (result.inLocal) {
        func(result.url, options, onComplete);
    }
    else if (result.inCache) {
        cacheManager.updateLastTime(url);
        func(result.url, options, function (err, data) {
            if (err) {
                cacheManager.removeCache(url);
            }
            onComplete(err, data);
        });
    }
    else {
        downloadFile(url, null, options.header, onFileProgress, function (err, path) {
            if (err) {
                onComplete(err, null);
                return;
            }
            func(path, options, function (err, data) {
                if (!err) {
                    cacheManager.tempFiles.add(url, path);
                    cacheManager.cacheFile(url, path, options.cacheEnabled, options.__cacheBundleRoot__, true);
                }
                onComplete(err, data);
            });
        });
    }
}

function parseArrayBuffer(url, options, onComplete) {
    readArrayBuffer(url, onComplete);
}

function parseText(url, options, onComplete) {
    readText(url, onComplete);
}

function parseJson(url, options, onComplete) {
    readJson(url, onComplete);
}

function downloadText(url, options, onComplete) {
    download(url, parseText, options, options.onFileProgress, onComplete);
}

var downloadJson = !isSubDomain ? function (url, options, onComplete) {
    download(url, parseJson, options, options.onFileProgress, onComplete);
} : function (url, options, onComplete) {
    var { url } = transformUrl(url, options);
    url = url.slice(SUBCONTEXT_ROOT.length + 1);  // remove subcontext root in url
    var content = $global.__cocos_require__($global.cc.path.changeExtname(url, '.js'));
    onComplete && onComplete(null, content);
}

var loadFont = !isSubDomain ? function (url, options, onComplete) {
    var fontFamily = $global.__globalAdapter.loadFont(url);
    onComplete(null, fontFamily || 'Arial');
} : function (url, options, onComplete) {
    onComplete(null, 'Arial');
}

function doNothing(content, options, onComplete) {
    exists(content, (existence) => {
        if (existence) {
            onComplete(null, content);
        } else {
            onComplete(new Error(`file ${content} does not exist!`));
        }
    });
}

function downloadAsset(url, options, onComplete) {
    download(url, doNothing, options, options.onFileProgress, onComplete);
}

function subdomainTransformUrl(url, options, onComplete) {
    var { url } = transformUrl(url, options);
    onComplete(null, url);
}

function downloadBundle(nameOrUrl, options, onComplete) {
    let bundleName = $global.cc.path.basename(nameOrUrl);
    var version = options.version || $global.cc.assetManager.downloader.bundleVers[bundleName];

    if (subpackages[bundleName]) {
        var config = `subpackages/${bundleName}/config.${version ? version + '.' : ''}json`;
        let loadedCb = function () {
            downloadJson(config, options, function (err, data) {
                data && (data.base = `subpackages/${bundleName}/`);
                onComplete(err, data);
            });
        };
        if (cachedSubpackageList[bundleName]) {
            return loadedCb();
        }
        loadSubpackage(bundleName, options.onFileProgress, function (err) {
            if (err) {
                onComplete(err, null);
                return;
            }
            cachedSubpackageList[bundleName] = true;
            loadedCb();
        });
    }
    else {
        let js, url;
        if (REGEX.test(nameOrUrl) || (!isSubDomain && nameOrUrl.startsWith(getUserDataPath()))) {
            url = nameOrUrl;
            js = `src/scripts/${bundleName}/index.js`;
            cacheManager.makeBundleFolder(bundleName);
        }
        else {
            if (remoteBundles[bundleName]) {
                url = `${REMOTE_SERVER_ROOT}remote/${bundleName}`;
                js = `src/scripts/${bundleName}/index.js`;
                cacheManager.makeBundleFolder(bundleName);
            }
            else {
                url = `assets/${bundleName}`;
                js = `assets/${bundleName}/index.js`;
            }
        }
        $global.__cocos_require__(js);
        options.__cacheBundleRoot__ = bundleName;
        var config = `${url}/config.${version ? version + '.' : ''}json`;
        downloadJson(config, options, function (err, data) {
            if (err) {
                onComplete && onComplete(err);
                return;
            }
            if (data.isZip) {
                let zipVersion = data.zipVersion;
                let zipUrl = `${url}/res.${zipVersion ? zipVersion + '.' : ''}zip`;
                handleZip(zipUrl, options, function (err, unzipPath) {
                    if (err) {
                        onComplete && onComplete(err);
                        return;
                    }
                    data.base = unzipPath + '/res/';
                    // PATCH: for android alipay version before v10.1.95 (v10.1.95 included)
                    // to remove in the future
                    let sys = $global.cc.sys;
                    if (sys.platform === sys.ALIPAY_GAME && sys.os === sys.OS_ANDROID) {
                        let resPath = unzipPath + 'res/';
                        if (fs.accessSync({ path: resPath })) {
                            data.base = resPath;
                        }
                    }
                    onComplete && onComplete(null, data);
                });
            }
            else {
                data.base = url + '/';
                onComplete && onComplete(null, data);
            }
        });
    }
};

const originParsePVRTex = parser.parsePVRTex;
let parsePVRTex = function (file, options, onComplete) {
    readArrayBuffer(file, function (err, data) {
        if (err) return onComplete(err);
        originParsePVRTex(data, options, onComplete);
    });
};

const originParsePKMTex = parser.parsePKMTex;
let parsePKMTex = function (file, options, onComplete) {
    readArrayBuffer(file, function (err, data) {
        if (err) return onComplete(err);
        originParsePKMTex(data, options, onComplete);
    });
};

function parsePlist(url, options, onComplete) {
    readText(url, function (err, file) {
        var result = null;
        if (!err) {
            result = $global.cc.plistParser.parse(file);
            if (!result) err = new Error('parse failed');
        }
        onComplete && onComplete(err, result);
    });
}

let downloadImage = isSubDomain ? subdomainTransformUrl : downloadAsset;
downloader.downloadDomAudio = downloadDomAudio;
downloader.downloadScript = downloadScript;
parser.parsePVRTex = parsePVRTex;
parser.parsePKMTex = parsePKMTex;

downloader.register({
    '.js': downloadScript,

    // Audio
    '.mp3': downloadAsset,
    '.ogg': downloadAsset,
    '.wav': downloadAsset,
    '.m4a': downloadAsset,

    // Image
    '.png': downloadImage,
    '.jpg': downloadImage,
    '.bmp': downloadImage,
    '.jpeg': downloadImage,
    '.gif': downloadImage,
    '.ico': downloadImage,
    '.tiff': downloadImage,
    '.image': downloadImage,
    '.webp': downloadImage,
    '.pvr': downloadAsset,
    '.pkm': downloadAsset,

    '.font': downloadAsset,
    '.eot': downloadAsset,
    '.ttf': downloadAsset,
    '.woff': downloadAsset,
    '.svg': downloadAsset,
    '.ttc': downloadAsset,

    // Txt
    '.txt': downloadAsset,
    '.xml': downloadAsset,
    '.vsh': downloadAsset,
    '.fsh': downloadAsset,
    '.atlas': downloadAsset,

    '.tmx': downloadAsset,
    '.tsx': downloadAsset,
    '.plist': downloadAsset,
    '.fnt': downloadAsset,

    '.json': downloadJson,
    '.ExportJson': downloadAsset,

    '.binary': downloadAsset,
    '.bin': downloadAsset,
    '.dbbin': downloadAsset,
    '.skel': downloadAsset,

    '.mp4': downloadAsset,
    '.avi': downloadAsset,
    '.mov': downloadAsset,
    '.mpg': downloadAsset,
    '.mpeg': downloadAsset,
    '.rm': downloadAsset,
    '.rmvb': downloadAsset,

    'bundle': downloadBundle,

    'default': downloadText,
});

parser.register({
    '.png': downloader.downloadDomImage,
    '.jpg': downloader.downloadDomImage,
    '.bmp': downloader.downloadDomImage,
    '.jpeg': downloader.downloadDomImage,
    '.gif': downloader.downloadDomImage,
    '.ico': downloader.downloadDomImage,
    '.tiff': downloader.downloadDomImage,
    '.image': downloader.downloadDomImage,
    '.webp': downloader.downloadDomImage,
    '.pvr': parsePVRTex,
    '.pkm': parsePKMTex,

    '.font': loadFont,
    '.eot': loadFont,
    '.ttf': loadFont,
    '.woff': loadFont,
    '.svg': loadFont,
    '.ttc': loadFont,

    // Audio
    '.mp3': downloadDomAudio,
    '.ogg': downloadDomAudio,
    '.wav': downloadDomAudio,
    '.m4a': downloadDomAudio,

    // Txt
    '.txt': parseText,
    '.xml': parseText,
    '.vsh': parseText,
    '.fsh': parseText,
    '.atlas': parseText,

    '.tmx': parseText,
    '.tsx': parseText,
    '.fnt': parseText,
    '.plist': parsePlist,

    '.binary': parseArrayBuffer,
    '.bin': parseArrayBuffer,
    '.dbbin': parseArrayBuffer,
    '.skel': parseArrayBuffer,

    '.ExportJson': parseJson,
});

var transformUrl = !isSubDomain ? function (url, options) {
    var inLocal = false;
    var inCache = false;
    var isInUserDataPath = url.startsWith(getUserDataPath());
    if (isInUserDataPath) {
        inLocal = true;
    }
    else if (REGEX.test(url)) {
        if (!options.reload) {
            var cache = cacheManager.cachedFiles.get(url);
            if (cache) {
                inCache = true;
                url = cache.url;
            }
            else {
                var tempUrl = cacheManager.tempFiles.get(url);
                if (tempUrl) {
                    inLocal = true;
                    url = tempUrl;
                }
            }
        }
    }
    else {
        inLocal = true;
    }
    return { url, inLocal, inCache };
} : function (url, options) {
    if (!REGEX.test(url)) {
        url = SUBCONTEXT_ROOT + '/' + url;
    }
    return { url };
}

if (!isSubDomain) {
    $global.cc.assetManager.transformPipeline.append(function (task) {
        var input = task.output = task.input;
        for (var i = 0, l = input.length; i < l; i++) {
            var item = input[i];
            var options = item.options;
            if (!item.config) {
                if (item.ext === 'bundle') continue;
                options.cacheEnabled = options.cacheEnabled !== undefined ? options.cacheEnabled : false;
            }
            else {
                options.__cacheBundleRoot__ = item.config.name;
            }
        }
    });

    var originInit = $global.cc.assetManager.init;
    $global.cc.assetManager.init = function (options) {
        originInit.call($global.cc.assetManager, options);
        options.subpackages && options.subpackages.forEach(x => subpackages[x] = 'subpackages/' + x);
        options.remoteBundles && options.remoteBundles.forEach(x => remoteBundles[x] = true);
        REMOTE_SERVER_ROOT = options.server || '';
        if (REMOTE_SERVER_ROOT && !REMOTE_SERVER_ROOT.endsWith('/')) REMOTE_SERVER_ROOT += '/';
        cacheManager.init();
    };
}
else {
    var originInit = $global.cc.assetManager.init;
    $global.cc.assetManager.init = function (options) {
        originInit.call($global.cc.assetManager, options);
        SUBCONTEXT_ROOT = options.subContextRoot || '';
    };
}



/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/Audio.js":
/*!******************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/Audio.js ***!
  \******************************************************************/
/***/ (() => {

const Audio = $global.cc._Audio;

if (Audio) {
    let originGetDuration = Audio.prototype.getDuration;
    Object.assign(Audio.prototype, {
        _createElement () {
            let elem = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = $global.__globalAdapter.createInnerAudioContext();
            }
            this._element.src = elem.src;
        },

        destroy () {
            if (this._element) {
                this._element.destroy();
                this._element = null;
            }
        },

        setCurrentTime (num) {
            let self = this;
            this._src && this._src._ensureLoaded(function () {
                self._element.seek(num);
            });
        },

        stop () {
            let self = this;
            this._src && this._src._ensureLoaded(function () {
                // HACK: some platforms won't set currentTime to 0 when stop audio
                self._element.seek(0);
                self._element.stop();
                self._unbindEnded();
                self.emit('stop');
                self._state = Audio.State.STOPPED;
            });
        },

        _bindEnded () {
            let elem = this._element;
            if (elem && elem.onEnded && !this._onended._binded) {
              this._onended._binded = true;
              elem.onEnded(this._onended);
            }
        },

        _unbindEnded () {
            let elem = this._element;
            if (elem && elem.offEnded && this._onended._binded) {
              this._onended._binded = false;
              elem.offEnded && elem.offEnded(this._onended);
            }
        },

        getDuration () {
            let duration = originGetDuration.call(this);
            // HACK: in mini game, if dynamicly load audio, can't get duration from audioClip
            // because duration is not coming from audio deserialization
            duration = duration || (this._element ? this._element.duration : 0);
            return duration;
        },

        // adapt some special operations on web platform
        _touchToPlay () { },
        _forceUpdatingState () { },
    });
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/AudioEngine.js":
/*!************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/AudioEngine.js ***!
  \************************************************************************/
/***/ (() => {

if ($global.cc && $global.cc.audioEngine) {
    $global.cc.audioEngine._maxAudioInstance = 10;
}

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/DeviceMotionEvent.js":
/*!******************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/DeviceMotionEvent.js ***!
  \******************************************************************************/
/***/ (() => {

var window = $global;


const inputManager = $global.cc.internal.inputManager;
const globalAdapter = window.__globalAdapter;

Object.assign(inputManager, {
    setAccelerometerEnabled (isEnable) {
        let scheduler = $global.cc.director.getScheduler();
        scheduler.enableForTarget(this);
        if (isEnable) {
            this._registerAccelerometerEvent();
            scheduler.scheduleUpdate(this);
        }
        else {
            this._unregisterAccelerometerEvent();
            scheduler.unscheduleUpdate(this);
        }
    },

    // No need to adapt
    // setAccelerometerInterval (interval) {  },

    _registerAccelerometerEvent () {
        this._accelCurTime = 0;
        let self = this;
        this._acceleration = new $global.cc.Acceleration(); 
        globalAdapter.startAccelerometer(function (res) {
            self._acceleration.x = res.x;
            self._acceleration.y = res.y;
            self._acceleration.z = res.y;
        });
    },

    _unregisterAccelerometerEvent () {
        this._accelCurTime = 0;  
        globalAdapter.stopAccelerometer();
    },
});


/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/Editbox.js":
/*!********************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/Editbox.js ***!
  \********************************************************************/
/***/ (() => {

(function () {
    if (!($global.cc && $global.cc.EditBox)) {
        return;
    }
    
    const EditBox = $global.cc.EditBox;
    const js = $global.cc.js;
    const KeyboardReturnType = EditBox.KeyboardReturnType;
    const MAX_VALUE = 65535;
    const KEYBOARD_HIDE_TIME = 600;
    let _hideKeyboardTimeout = null;
    let _currentEditBoxImpl = null;

    function getKeyboardReturnType (type) {
        switch (type) {
            case KeyboardReturnType.DEFAULT:
            case KeyboardReturnType.DONE:
                return 'done';
            case KeyboardReturnType.SEND:
                return 'send';
            case KeyboardReturnType.SEARCH:
                return 'search';
            case KeyboardReturnType.GO:
                return 'go';
            case KeyboardReturnType.NEXT:
                return 'next';
        }
        return 'done';
    }

    const BaseClass = EditBox._ImplClass;
    function MiniGameEditBoxImpl () {
        BaseClass.call(this);

        this._eventListeners = {
            onKeyboardInput: null,
            onKeyboardConfirm: null,
            onKeyboardComplete: null,
        };
    }

    js.extend(MiniGameEditBoxImpl, BaseClass);
    EditBox._ImplClass = MiniGameEditBoxImpl;

    Object.assign(MiniGameEditBoxImpl.prototype, {
        init (delegate) {
            if (!delegate) {
                $global.cc.error('EditBox init failed');
                return;
            }
            this._delegate = delegate;
        },

        beginEditing () {
            // In case multiply register events
            if (this._editing) {
                return;
            }
            this._ensureKeyboardHide(() => {
                let delegate = this._delegate;
                this._showKeyboard();
                this._registerKeyboardEvent();
                this._editing = true;
                _currentEditBoxImpl = this;
                delegate.editBoxEditingDidBegan();
            });
        },

        endEditing () {
            this._hideKeyboard();
            let cbs = this._eventListeners;
            cbs.onKeyboardComplete && cbs.onKeyboardComplete();
        },

        _registerKeyboardEvent () {
            let self = this;
            let delegate = this._delegate;
            let cbs = this._eventListeners;

            cbs.onKeyboardInput = function (res) {
                if (delegate._string !== res.value) {
                    delegate.editBoxTextChanged(res.value);
                }
            }

            cbs.onKeyboardConfirm = function (res) {
                delegate.editBoxEditingReturn();
                let cbs = self._eventListeners;
                cbs.onKeyboardComplete && cbs.onKeyboardComplete();
            }

            cbs.onKeyboardComplete = function () {
                self._editing = false;
                _currentEditBoxImpl = null;
                self._unregisterKeyboardEvent();
                delegate.editBoxEditingDidEnded();
            }

            $global.__globalAdapter.onKeyboardInput(cbs.onKeyboardInput);
            $global.__globalAdapter.onKeyboardConfirm(cbs.onKeyboardConfirm);
            $global.__globalAdapter.onKeyboardComplete(cbs.onKeyboardComplete);
        },

        _unregisterKeyboardEvent () {
            let cbs = this._eventListeners;

            if (cbs.onKeyboardInput) {
                $global.__globalAdapter.offKeyboardInput(cbs.onKeyboardInput);
                cbs.onKeyboardInput = null;
            }
            if (cbs.onKeyboardConfirm) {
                $global.__globalAdapter.offKeyboardConfirm(cbs.onKeyboardConfirm);
                cbs.onKeyboardConfirm = null;
            }
            if (cbs.onKeyboardComplete) {
                $global.__globalAdapter.offKeyboardComplete(cbs.onKeyboardComplete);
                cbs.onKeyboardComplete = null;
            }
        },

        _otherEditing () {
            return !!_currentEditBoxImpl && _currentEditBoxImpl !== this && _currentEditBoxImpl._editing;
        },

        _ensureKeyboardHide (cb) {
            let otherEditing = this._otherEditing();
            if (!otherEditing && !_hideKeyboardTimeout) {
                return cb();
            }
            if (_hideKeyboardTimeout) {
                clearTimeout(_hideKeyboardTimeout);
            }
            if (otherEditing) {
                _currentEditBoxImpl.endEditing();
            }
            _hideKeyboardTimeout = setTimeout(() => {
                _hideKeyboardTimeout = null;
                cb();
            }, KEYBOARD_HIDE_TIME);
        },

        _showKeyboard () {
            let delegate = this._delegate;
            let multiline = (delegate.inputMode === EditBox.InputMode.ANY);
            let maxLength = (delegate.maxLength < 0 ? MAX_VALUE : delegate.maxLength);

            $global.__globalAdapter.showKeyboard({
                defaultValue: delegate._string,
                maxLength: maxLength,
                multiple: multiline,
                confirmHold: false,
                confirmType: getKeyboardReturnType(delegate.returnType),
                success (res) {

                },
                fail (res) {
                    $global.cc.warn(res.errMsg);
                }
            });
        },

        _hideKeyboard () {
            $global.__globalAdapter.hideKeyboard({
                success (res) {
                    
                },
                fail (res) {
                    $global.cc.warn(res.errMsg);
                },
            });
        },
    });
})();



/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/Game.js":
/*!*****************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/Game.js ***!
  \*****************************************************************/
/***/ (() => {

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


/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/InputManager.js":
/*!*************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/InputManager.js ***!
  \*************************************************************************/
/***/ (() => {

var window = $global;

const mgr = $global.cc.internal.inputManager;
const canvasPosition = {
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight
};

if (mgr) {
    Object.assign(mgr, {
        _updateCanvasBoundingRect () {},
        
        registerSystemEvent (element) {
            if(this._isRegisterEvent) return;
    
            this._glView = $global.cc.view;
            let self = this;
    
            //register touch event
            let _touchEventsMap = {
                onTouchStart: this.handleTouchesBegin,
                onTouchMove: this.handleTouchesMove,
                onTouchEnd: this.handleTouchesEnd,
                onTouchCancel: this.handleTouchesCancel,
            };
    
            let registerTouchEvent = function (eventName) {
                let handler = _touchEventsMap[eventName];
                $global.__globalAdapter[eventName](function (event) {
                    if (!event.changedTouches) return;
                    handler.call(self, self.getTouchesByEvent(event, canvasPosition));
                });
            };
    
            for (let eventName in _touchEventsMap) {
                registerTouchEvent(eventName);
            }
    
            this._isRegisterEvent = true;
        },
    });
}

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/Screen.js":
/*!*******************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/Screen.js ***!
  \*******************************************************************/
/***/ (() => {

Object.assign($global.cc.screen, {    
    autoFullScreen: function (element, onFullScreenChange) {
        // Not support on mini game
    }
});

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/Texture2D.js":
/*!**********************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/Texture2D.js ***!
  \**********************************************************************/
/***/ (() => {

const Texture2D = $global.cc.Texture2D;

if (Texture2D) {
    Object.assign(Texture2D.prototype, {
        initWithElement (element) {
            if (!element)
                return;
            this._image = element;
            this.handleLoadedTexture();
        },
    });
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/globalAdapter/BaseSystemInfo.js":
/*!*****************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/globalAdapter/BaseSystemInfo.js ***!
  \*****************************************************************************************/
/***/ ((module) => {

var window = $global;

function adaptSys (sys, env) {
    if (!env) {
        env = $global.__globalAdapter.getSystemInfoSync();
    }

    var language = env.language || '';
    var system = env.system || 'iOS';
    var platform = env.platform || 'iOS';

    sys.isNative = false;
    sys.isBrowser = false;
    sys.isMobile = true;
    sys.language = language.substr(0, 2);
    sys.languageCode = language.toLowerCase();

    platform = platform.toLowerCase();
    if (platform === "android") {
        sys.os = sys.OS_ANDROID;
    }
    else if (platform === "ios") {
        sys.os = sys.OS_IOS;
    }

    system = system.toLowerCase();
    // Adaptation to Android P
    if (system === 'android p') {
        system = 'android p 9.0';
    }

    var version = /[\d\.]+/.exec(system);
    sys.osVersion = version ? version[0] : system;
    sys.osMainVersion = parseInt(sys.osVersion);
    sys.browserType = null;
    sys.browserVersion = null;

    var w = env.windowWidth;
    var h = env.windowHeight;
    var ratio = env.pixelRatio || 1;
    sys.windowPixelResolution = {
        width: ratio * w,
        height: ratio * h
    };

    sys.localStorage = window.localStorage;

    var _supportWebGL = $global.__globalAdapter.isSubContext ? false : true;;
    var _supportWebp = false;
    try {
        var _canvas = $global.document.createElement("canvas");
        _supportWebp = _canvas.toDataURL('image/webp').startsWith('data:image/webp');
    }
    catch (err) { }

    sys.capabilities = {
        "canvas": true,
        "opengl": !!_supportWebGL,
        "webp": _supportWebp
    };
    sys.__audioSupport = {
        ONLY_ONE: false,
        WEB_AUDIO: false,
        DELAY_CREATE_CTX: false,
        format: ['.mp3']
    };
}

module.exports = adaptSys;


/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/globalAdapter/ContainerStrategy.js":
/*!********************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/globalAdapter/ContainerStrategy.js ***!
  \********************************************************************************************/
/***/ ((module) => {

var window = $global;

function adaptContainerStrategy (containerStrategyProto) {
    containerStrategyProto._setupContainer = function (view, width, height) {
        // Setup pixel ratio for retina display
        var devicePixelRatio = view._devicePixelRatio = 1;
        if (view.isRetinaEnabled()) {
            devicePixelRatio = view._devicePixelRatio = Math.min(view._maxPixelRatio, window.devicePixelRatio || 1);
        }
        // size of sharedCanvas is readonly in subContext
        if ($global.__globalAdapter.isSubContext) {
            return;
        }
        let locCanvas = $global.cc.game.canvas;
        // Setup canvas
        width *= devicePixelRatio;
        height *= devicePixelRatio;
        // FIX: black screen on Baidu platform
        // reset canvas size may call gl.clear(), especially when you call cc.director.loadScene()
        if (locCanvas.width !== width || locCanvas.height !== height) {
            locCanvas.width = width;
            locCanvas.height = height;
        }
    };
}

module.exports = adaptContainerStrategy;

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/globalAdapter/View.js":
/*!*******************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/globalAdapter/View.js ***!
  \*******************************************************************************/
/***/ ((module) => {

var window = $global;

function adaptView (viewProto) {
    Object.assign(viewProto, {
        _adjustViewportMeta () {
            // minigame not support
        },

        setRealPixelResolution (width, height, resolutionPolicy) {
            // Reset the resolution size and policy
            this.setDesignResolutionSize(width, height, resolutionPolicy);
        },

        enableAutoFullScreen (enabled) {
            $global.cc.warn('cc.view.enableAutoFullScreen() is not supported on minigame platform.');
        },

        isAutoFullScreenEnabled () {
            return false;
        },

        setCanvasSize () {
            $global.cc.warn('cc.view.setCanvasSize() is not supported on minigame platform.');
        },

        setFrameSize () {
            $global.cc.warn('frame size is readonly on minigame platform.');
        },

        _initFrameSize () {
            let locFrameSize = this._frameSize;
            if ($global.__globalAdapter.isSubContext) {
                let sharedCanvas = window.sharedCanvas || $global.__globalAdapter.getSharedCanvas();
                locFrameSize.width = sharedCanvas.width;
                locFrameSize.height = sharedCanvas.height;
            }
            else {
                locFrameSize.width = window.innerWidth;
                locFrameSize.height = window.innerHeight;
            }
        },
    });
}

module.exports = adaptView;

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/globalAdapter/index.js":
/*!********************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/globalAdapter/index.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var window = $global;

const adapter = window.__globalAdapter;

Object.assign(adapter, {
    adaptSys: __webpack_require__(/*! ./BaseSystemInfo */ "./templates/cocos2-adapter-modified/common/engine/globalAdapter/BaseSystemInfo.js"),

    adaptView: __webpack_require__(/*! ./View */ "./templates/cocos2-adapter-modified/common/engine/globalAdapter/View.js"),

    adaptContainerStrategy: __webpack_require__(/*! ./ContainerStrategy */ "./templates/cocos2-adapter-modified/common/engine/globalAdapter/ContainerStrategy.js"),
});

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/index.js":
/*!******************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ./Audio */ "./templates/cocos2-adapter-modified/common/engine/Audio.js");
__webpack_require__(/*! ./AudioEngine */ "./templates/cocos2-adapter-modified/common/engine/AudioEngine.js");
__webpack_require__(/*! ./DeviceMotionEvent */ "./templates/cocos2-adapter-modified/common/engine/DeviceMotionEvent.js");
__webpack_require__(/*! ./Editbox */ "./templates/cocos2-adapter-modified/common/engine/Editbox.js");
__webpack_require__(/*! ./Game */ "./templates/cocos2-adapter-modified/common/engine/Game.js");
__webpack_require__(/*! ./InputManager */ "./templates/cocos2-adapter-modified/common/engine/InputManager.js");
__webpack_require__(/*! ./AssetManager */ "./templates/cocos2-adapter-modified/common/engine/AssetManager.js");
__webpack_require__(/*! ./Screen */ "./templates/cocos2-adapter-modified/common/engine/Screen.js");
__webpack_require__(/*! ./Texture2D */ "./templates/cocos2-adapter-modified/common/engine/Texture2D.js");
__webpack_require__(/*! ./misc */ "./templates/cocos2-adapter-modified/common/engine/misc.js");

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/engine/misc.js":
/*!*****************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/engine/misc.js ***!
  \*****************************************************************/
/***/ (() => {

$global.cc.macro.DOWNLOAD_MAX_CONCURRENT = 10;

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/utils.js":
/*!***********************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/utils.js ***!
  \***********************************************************/
/***/ ((module) => {

let utils = {
    /**
     * @param {Object} target 
     * @param {Object} origin 
     * @param {String} methodName 
     * @param {String} targetMethodName 
     */
    cloneMethod (target, origin, methodName, targetMethodName) {
        if (origin[methodName]) {
            targetMethodName = targetMethodName || methodName;
            target[targetMethodName] = origin[methodName].bind(origin);
        }
    }
};

module.exports = utils;

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/xmldom/dom-parser.js":
/*!***********************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/xmldom/dom-parser.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

function DOMParser(options){
	this.options = options ||{locator:{}};
	
}

DOMParser.prototype.parseFromString = function(source,mimeType){
	var options = this.options;
	var sax =  new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler();//contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns||{};
	var isHTML = /\/x?html?$/.test(mimeType);//mimeType.toLowerCase().indexOf('html') > -1;
  	var entityMap = isHTML?htmlEntity.entityMap:{'lt':'<','gt':'>','amp':'&','quot':'"','apos':"'"};
	if(locator){
		domBuilder.setDocumentLocator(locator)
	}
	
	sax.errorHandler = buildErrorHandler(errorHandler,domBuilder,locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if(isHTML){
		defaultNSMap['']= 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if(source){
		sax.parse(source,defaultNSMap,entityMap);
	}else{
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
}
function buildErrorHandler(errorImpl,domBuilder,locator){
	if(!errorImpl){
		if(domBuilder instanceof DOMHandler){
			return domBuilder;
		}
		errorImpl = domBuilder ;
	}
	var errorHandler = {}
	var isCallback = errorImpl instanceof Function;
	locator = locator||{}
	function build(key){
		var fn = errorImpl[key];
		if(!fn && isCallback){
			fn = errorImpl.length == 2?function(msg){errorImpl(key,msg)}:errorImpl;
		}
		errorHandler[key] = fn && function(msg){
			fn('[xmldom '+key+']\t'+msg+_locator(locator));
		}||function(){};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
    this.cdata = false;
}
function position(locator,node){
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */ 
DOMHandler.prototype = {
	startDocument : function() {
    	this.doc = new DOMImplementation().createDocument(null, null, null);
    	if (this.locator) {
        	this.doc.documentURI = this.locator.systemId;
    	}
	},
	startElement:function(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
	    var el = doc.createElementNS(namespaceURI, qName||localName);
	    var len = attrs.length;
	    appendElement(this, el);
	    this.currentElement = el;
	    
		this.locator && position(this.locator,el)
	    for (var i = 0 ; i < len; i++) {
	        var namespaceURI = attrs.getURI(i);
	        var value = attrs.getValue(i);
	        var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator &&position(attrs.getLocator(i),attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr)
	    }
	},
	endElement:function(namespaceURI, localName, qName) {
		var current = this.currentElement
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping:function(prefix, uri) {
	},
	endPrefixMapping:function(prefix) {
	},
	processingInstruction:function(target, data) {
	    var ins = this.doc.createProcessingInstruction(target, data);
	    this.locator && position(this.locator,ins)
	    appendElement(this, ins);
	},
	ignorableWhitespace:function(ch, start, length) {
	},
	characters:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
		//console.log(chars)
		if(chars){
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if(this.currentElement){
				this.currentElement.appendChild(charNode);
			}else if(/^\s*$/.test(chars)){
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator,charNode)
		}
	},
	skippedEntity:function(name) {
	},
	endDocument:function() {
		this.doc.normalize();
	},
	setDocumentLocator:function (locator) {
	    if(this.locator = locator){// && !('lineNumber' in locator)){
	    	locator.lineNumber = 0;
	    }
	},
	//LexicalHandler
	comment:function(chars, start, length) {
		chars = _toString.apply(this,arguments)
	    var comm = this.doc.createComment(chars);
	    this.locator && position(this.locator,comm)
	    appendElement(this, comm);
	},
	
	startCDATA:function() {
	    //used in characters() methods
	    this.cdata = true;
	},
	endCDATA:function() {
	    this.cdata = false;
	},
	
	startDTD:function(name, publicId, systemId) {
		var impl = this.doc.implementation;
	    if (impl && impl.createDocumentType) {
	        var dt = impl.createDocumentType(name, publicId, systemId);
	        this.locator && position(this.locator,dt)
	        appendElement(this, dt);
	    }
	},
	/**
	 * @see org.xml.sax.ErrorHandler
	 * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
	 */
	warning:function(error) {
		console.warn('[xmldom warning]\t'+error,_locator(this.locator));
	},
	error:function(error) {
		console.error('[xmldom error]\t'+error,_locator(this.locator));
	},
	fatalError:function(error) {
		console.error('[xmldom fatalError]\t'+error,_locator(this.locator));
	    throw error;
	}
}
function _locator(l){
	if(l){
		return '\n@'+(l.systemId ||'')+'#[line:'+l.lineNumber+',col:'+l.columnNumber+']'
	}
}
function _toString(chars,start,length){
	if(typeof chars == 'string'){
		return chars.substr(start,length)
	}else{//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if(chars.length >= start+length || start){
			return new $global.java.lang.String(chars,start,length)+'';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g,function(key){
	DOMHandler.prototype[key] = function(){return null}
})

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement (hander,node) {
    if (!hander.currentElement) {
        hander.doc.appendChild(node);
    } else {
        hander.currentElement.appendChild(node);
    }
}//appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
var htmlEntity = __webpack_require__(/*! ./entities */ "./templates/cocos2-adapter-modified/common/xmldom/entities.js");
var XMLReader = __webpack_require__(/*! ./sax */ "./templates/cocos2-adapter-modified/common/xmldom/sax.js").XMLReader;
var DOMImplementation = exports.DOMImplementation = __webpack_require__(/*! ./dom */ "./templates/cocos2-adapter-modified/common/xmldom/dom.js").DOMImplementation;
exports.XMLSerializer = __webpack_require__(/*! ./dom */ "./templates/cocos2-adapter-modified/common/xmldom/dom.js").XMLSerializer ;
exports.DOMParser = DOMParser;
//}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/xmldom/dom.js":
/*!****************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/xmldom/dom.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src,dest){
	for(var p in src){
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class,Super){
	var pt = Class.prototype;
	if(!(pt instanceof Super)){
		function t(){};
		t.prototype = Super.prototype;
		t = new t();
		// copy(pt,t);
        for(var p in pt){
            t[p] = pt[p];
        }
		Class.prototype = pt = t;
	}
	if(pt.constructor != Class){
		if(typeof Class != 'function'){
			console.error("unknow Class:"+Class)
		}
		pt.constructor = Class
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml' ;
// Node Types
var NodeType = {}
var ELEMENT_NODE                = NodeType.ELEMENT_NODE                = 1;
var ATTRIBUTE_NODE              = NodeType.ATTRIBUTE_NODE              = 2;
var TEXT_NODE                   = NodeType.TEXT_NODE                   = 3;
var CDATA_SECTION_NODE          = NodeType.CDATA_SECTION_NODE          = 4;
var ENTITY_REFERENCE_NODE       = NodeType.ENTITY_REFERENCE_NODE       = 5;
var ENTITY_NODE                 = NodeType.ENTITY_NODE                 = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE                = NodeType.COMMENT_NODE                = 8;
var DOCUMENT_NODE               = NodeType.DOCUMENT_NODE               = 9;
var DOCUMENT_TYPE_NODE          = NodeType.DOCUMENT_TYPE_NODE          = 10;
var DOCUMENT_FRAGMENT_NODE      = NodeType.DOCUMENT_FRAGMENT_NODE      = 11;
var NOTATION_NODE               = NodeType.NOTATION_NODE               = 12;

// ExceptionCode
var ExceptionCode = {}
var ExceptionMessage = {};
var INDEX_SIZE_ERR              = ExceptionCode.INDEX_SIZE_ERR              = ((ExceptionMessage[1]="Index size error"),1);
var DOMSTRING_SIZE_ERR          = ExceptionCode.DOMSTRING_SIZE_ERR          = ((ExceptionMessage[2]="DOMString size error"),2);
var HIERARCHY_REQUEST_ERR       = ExceptionCode.HIERARCHY_REQUEST_ERR       = ((ExceptionMessage[3]="Hierarchy request error"),3);
var WRONG_DOCUMENT_ERR          = ExceptionCode.WRONG_DOCUMENT_ERR          = ((ExceptionMessage[4]="Wrong document"),4);
var INVALID_CHARACTER_ERR       = ExceptionCode.INVALID_CHARACTER_ERR       = ((ExceptionMessage[5]="Invalid character"),5);
var NO_DATA_ALLOWED_ERR         = ExceptionCode.NO_DATA_ALLOWED_ERR         = ((ExceptionMessage[6]="No data allowed"),6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = ((ExceptionMessage[7]="No modification allowed"),7);
var NOT_FOUND_ERR               = ExceptionCode.NOT_FOUND_ERR               = ((ExceptionMessage[8]="Not found"),8);
var NOT_SUPPORTED_ERR           = ExceptionCode.NOT_SUPPORTED_ERR           = ((ExceptionMessage[9]="Not supported"),9);
var INUSE_ATTRIBUTE_ERR         = ExceptionCode.INUSE_ATTRIBUTE_ERR         = ((ExceptionMessage[10]="Attribute in use"),10);
//level2
var INVALID_STATE_ERR        	= ExceptionCode.INVALID_STATE_ERR        	= ((ExceptionMessage[11]="Invalid state"),11);
var SYNTAX_ERR               	= ExceptionCode.SYNTAX_ERR               	= ((ExceptionMessage[12]="Syntax error"),12);
var INVALID_MODIFICATION_ERR 	= ExceptionCode.INVALID_MODIFICATION_ERR 	= ((ExceptionMessage[13]="Invalid modification"),13);
var NAMESPACE_ERR            	= ExceptionCode.NAMESPACE_ERR           	= ((ExceptionMessage[14]="Invalid namespace"),14);
var INVALID_ACCESS_ERR       	= ExceptionCode.INVALID_ACCESS_ERR      	= ((ExceptionMessage[15]="Invalid access"),15);


function DOMException(code, message) {
	if(message instanceof Error){
		var error = message;
	}else{
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if(Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if(message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode,DOMException)
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {
};
NodeList.prototype = {
	/**
	 * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
	 * @standard level1
	 */
	length:0, 
	/**
	 * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
	 * @standard level1
	 * @param index  unsigned long 
	 *   Index into the collection.
	 * @return Node
	 * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
	 */
	item: function(index) {
		return this[index] || null;
	},
	toString:function(isHTML,nodeFilter){
		for(var buf = [], i = 0;i<this.length;i++){
			serializeToString(this[i],buf,isHTML,nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node,refresh){
	this._node = node;
	this._refresh = refresh
	_updateLiveList(this);
}
function _updateLiveList(list){
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if(list._inc != inc){
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list,'length',ls.length);
		//copy(ls,list);
        for(var p in ls){
            list[p] = ls[p];
        }
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function(i){
	_updateLiveList(this);
	return this[i];
}

_extends(LiveNodeList,NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {
};

function _findNodeIndex(list,node){
	var i = list.length;
	while(i--){
		if(list[i] === node){return i}
	}
}

function _addNamedNode(el,list,newAttr,oldAttr){
	if(oldAttr){
		list[_findNodeIndex(list,oldAttr)] = newAttr;
	}else{
		list[list.length++] = newAttr;
	}
	if(el){
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if(doc){
			oldAttr && _onRemoveAttribute(doc,el,oldAttr);
			_onAddAttribute(doc,el,newAttr);
		}
	}
}
function _removeNamedNode(el,list,attr){
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list,attr);
	if(i>=0){
		var lastIndex = list.length-1
		while(i<lastIndex){
			list[i] = list[++i]
		}
		list.length = lastIndex;
		if(el){
			var doc = el.ownerDocument;
			if(doc){
				_onRemoveAttribute(doc,el,attr);
				attr.ownerElement = null;
			}
		}
	}else{
		throw DOMException(NOT_FOUND_ERR,new Error(el.tagName+'@'+attr))
	}
}
NamedNodeMap.prototype = {
	length:0,
	item:NodeList.prototype.item,
	getNamedItem: function(key) {
//		if(key.indexOf(':')>0 || key == 'xmlns'){
//			return null;
//		}
		//console.log()
		var i = this.length;
		while(i--){
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if(attr.nodeName == key){
				return attr;
			}
		}
	},
	setNamedItem: function(attr) {
		var el = attr.ownerElement;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function(attr) {// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement, oldAttr;
		if(el && el!=this._ownerElement){
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI,attr.localName);
		_addNamedNode(this._ownerElement,this,attr,oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
		
		
	},// raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
	
	//for level2
	removeNamedItemNS:function(namespaceURI,localName){
		var attr = this.getNamedItemNS(namespaceURI,localName);
		_removeNamedNode(this._ownerElement,this,attr);
		return attr;
	},
	getNamedItemNS: function(namespaceURI, localName) {
		var i = this.length;
		while(i--){
			var node = this[i];
			if(node.localName == localName && node.namespaceURI == namespaceURI){
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation(/* Object */ features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			 this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function(/* string */ feature, /* string */ version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument:function(namespaceURI,  qualifiedName, doctype){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if(doctype){
			doc.appendChild(doctype);
		}
		if(qualifiedName){
			var root = doc.createElementNS(namespaceURI,qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType:function(qualifiedName, publicId, systemId){// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;
		
		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};


/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {
};

Node.prototype = {
	firstChild : null,
	lastChild : null,
	previousSibling : null,
	nextSibling : null,
	attributes : null,
	parentNode : null,
	childNodes : null,
	ownerDocument : null,
	nodeValue : null,
	namespaceURI : null,
	prefix : null,
	localName : null,
	// Modified in DOM Level 2:
	insertBefore:function(newChild, refChild){//raises 
		return _insertBefore(this,newChild,refChild);
	},
	replaceChild:function(newChild, oldChild){//raises 
		this.insertBefore(newChild,oldChild);
		if(oldChild){
			this.removeChild(oldChild);
		}
	},
	removeChild:function(oldChild){
		return _removeChild(this,oldChild);
	},
	appendChild:function(newChild){
		return this.insertBefore(newChild,null);
	},
	hasChildNodes:function(){
		return this.firstChild != null;
	},
	cloneNode:function(deep){
		return cloneNode(this.ownerDocument||this,this,deep);
	},
	// Modified in DOM Level 2:
	normalize:function(){
		var child = this.firstChild;
		while(child){
			var next = child.nextSibling;
			if(next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE){
				this.removeChild(next);
				child.appendData(next.data);
			}else{
				child.normalize();
				child = next;
			}
		}
	},
  	// Introduced in DOM Level 2:
	isSupported:function(feature, version){
		return this.ownerDocument.implementation.hasFeature(feature,version);
	},
    // Introduced in DOM Level 2:
    hasAttributes:function(){
    	return this.attributes.length>0;
    },
    lookupPrefix:function(namespaceURI){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			for(var n in map){
    				if(map[n] == namespaceURI){
    					return n;
    				}
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    lookupNamespaceURI:function(prefix){
    	var el = this;
    	while(el){
    		var map = el._nsMap;
    		//console.dir(map)
    		if(map){
    			if(prefix in map){
    				return map[prefix] ;
    			}
    		}
    		el = el.nodeType == ATTRIBUTE_NODE?el.ownerDocument : el.parentNode;
    	}
    	return null;
    },
    // Introduced in DOM Level 3:
    isDefaultNamespace:function(namespaceURI){
    	var prefix = this.lookupPrefix(namespaceURI);
    	return prefix == null;
    }
};


function _xmlEncoder(c){
	return c == '<' && '&lt;' ||
         c == '>' && '&gt;' ||
         c == '&' && '&amp;' ||
         c == '"' && '&quot;' ||
         '&#'+c.charCodeAt()+';'
}


copy(NodeType,Node);
copy(NodeType,Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node,callback){
	if(callback(node)){
		return true;
	}
	if(node = node.firstChild){
		do{
			if(_visitNode(node,callback)){return true}
        }while(node=node.nextSibling)
    }
}



function Document(){
}
function _onAddAttribute(doc,el,newAttr){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		el._nsMap[newAttr.prefix?newAttr.localName:''] = newAttr.value
	}
}
function _onRemoveAttribute(doc,el,newAttr,remove){
	doc && doc._inc++;
	var ns = newAttr.namespaceURI ;
	if(ns == 'http://www.w3.org/2000/xmlns/'){
		//update namespace
		delete el._nsMap[newAttr.prefix?newAttr.localName:'']
	}
}
function _onUpdateChild(doc,el,newChild){
	if(doc && doc._inc){
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if(newChild){
			cs[cs.length++] = newChild;
		}else{
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while(child){
				cs[i++] = child;
				child =child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode,child){
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if(previous){
		previous.nextSibling = next;
	}else{
		parentNode.firstChild = next
	}
	if(next){
		next.previousSibling = previous;
	}else{
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument,parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode,newChild,nextChild){
	var cp = newChild.parentNode;
	if(cp){
		cp.removeChild(newChild);//remove and update
	}
	if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	}else{
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;
	
	
	if(pre){
		pre.nextSibling = newFirst;
	}else{
		parentNode.firstChild = newFirst;
	}
	if(nextChild == null){
		parentNode.lastChild = newLast;
	}else{
		nextChild.previousSibling = newLast;
	}
	do{
		newFirst.parentNode = parentNode;
	}while(newFirst !== newLast && (newFirst= newFirst.nextSibling))
	_onUpdateChild(parentNode.ownerDocument||parentNode,parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode,newChild){
	var cp = newChild.parentNode;
	if(cp){
		var pre = parentNode.lastChild;
		cp.removeChild(newChild);//remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if(pre){
		pre.nextSibling = newChild;
	}else{
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument,parentNode,newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName :  '#document',
	nodeType :  DOCUMENT_NODE,
	doctype :  null,
	documentElement :  null,
	_inc : 1,
	
	insertBefore :  function(newChild, refChild){//raises 
		if(newChild.nodeType == DOCUMENT_FRAGMENT_NODE){
			var child = newChild.firstChild;
			while(child){
				var next = child.nextSibling;
				this.insertBefore(child,refChild);
				child = next;
			}
			return newChild;
		}
		if(this.documentElement == null && newChild.nodeType == ELEMENT_NODE){
			this.documentElement = newChild;
		}
		
		return _insertBefore(this,newChild,refChild),(newChild.ownerDocument = this),newChild;
	},
	removeChild :  function(oldChild){
		if(this.documentElement == oldChild){
			this.documentElement = null;
		}
		return _removeChild(this,oldChild);
	},
	// Introduced in DOM Level 2:
	importNode : function(importedNode,deep){
		return importNode(this,importedNode,deep);
	},
	// Introduced in DOM Level 2:
	getElementById :	function(id){
		var rtv = null;
		_visitNode(this.documentElement,function(node){
			if(node.nodeType == ELEMENT_NODE){
				if(node.getAttribute('id') == id){
					rtv = node;
					return true;
				}
			}
		})
		return rtv;
	},
	
	//document factory method:
	createElement :	function(tagName){
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs	= node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment :	function(){
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode :	function(data){
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createComment :	function(data){
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createCDATASection :	function(data){
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data)
		return node;
	},
	createProcessingInstruction :	function(target,data){
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue= node.data = data;
		return node;
	},
	createAttribute :	function(name){
		var node = new Attr();
		node.ownerDocument	= this;
		node.name = name;
		node.nodeName	= name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference :	function(name){
		var node = new EntityReference();
		node.ownerDocument	= this;
		node.nodeName	= name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS :	function(namespaceURI,qualifiedName){
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs	= node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS :	function(namespaceURI,qualifiedName){
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if(pl.length == 2){
			node.prefix = pl[0];
			node.localName = pl[1];
		}else{
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document,Node);


function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType : ELEMENT_NODE,
	hasAttribute : function(name){
		return this.getAttributeNode(name)!=null;
	},
	getAttribute : function(name){
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode : function(name){
		return this.attributes.getNamedItem(name);
	},
	setAttribute : function(name, value){
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	removeAttribute : function(name){
		var attr = this.getAttributeNode(name)
		attr && this.removeAttributeNode(attr);
	},
	
	//four real opeartion method
	appendChild:function(newChild){
		if(newChild.nodeType === DOCUMENT_FRAGMENT_NODE){
			return this.insertBefore(newChild,null);
		}else{
			return _appendSingleChild(this,newChild);
		}
	},
	setAttributeNode : function(newAttr){
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS : function(newAttr){
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode : function(oldAttr){
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS : function(namespaceURI, localName){
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},
	
	hasAttributeNS : function(namespaceURI, localName){
		return this.getAttributeNodeNS(namespaceURI, localName)!=null;
	},
	getAttributeNS : function(namespaceURI, localName){
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS : function(namespaceURI, qualifiedName, value){
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr)
	},
	getAttributeNodeNS : function(namespaceURI, localName){
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},
	
	getElementsByTagName : function(tagName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)){
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS : function(namespaceURI, localName){
		return new LiveNodeList(this,function(base){
			var ls = [];
			_visitNode(base,function(node){
				if(node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)){
					ls.push(node);
				}
			});
			return ls;
			
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;


_extends(Element,Node);
function Attr() {
};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr,Node);


function CharacterData() {
};
CharacterData.prototype = {
	data : '',
	substringData : function(offset, count) {
		return this.data.substring(offset, offset+count);
	},
	appendData: function(text) {
		text = this.data+text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function(offset,text) {
		this.replaceData(offset,0,text);
	
	},
	appendChild:function(newChild){
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR])
	},
	deleteData: function(offset, count) {
		this.replaceData(offset,count,"");
	},
	replaceData: function(offset, count, text) {
		var start = this.data.substring(0,offset);
		var end = this.data.substring(offset+count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
}
_extends(CharacterData,Node);
function Text() {
};
Text.prototype = {
	nodeName : "#text",
	nodeType : TEXT_NODE,
	splitText : function(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if(this.parentNode){
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
}
_extends(Text,CharacterData);
function Comment() {
};
Comment.prototype = {
	nodeName : "#comment",
	nodeType : COMMENT_NODE
}
_extends(Comment,CharacterData);

function CDATASection() {
};
CDATASection.prototype = {
	nodeName : "#cdata-section",
	nodeType : CDATA_SECTION_NODE
}
_extends(CDATASection,CharacterData);


function DocumentType() {
};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType,Node);

function Notation() {
};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation,Node);

function Entity() {
};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity,Node);

function EntityReference() {
};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference,Node);

function DocumentFragment() {
};
DocumentFragment.prototype.nodeName =	"#document-fragment";
DocumentFragment.prototype.nodeType =	DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment,Node);


function ProcessingInstruction() {
}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction,Node);
function XMLSerializer(){}
XMLSerializer.prototype.serializeToString = function(node,isHtml,nodeFilter){
	return nodeSerializeToString.call(node,isHtml,nodeFilter);
}
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml,nodeFilter){
	var buf = [];
	var refNode = this.nodeType == 9 && this.documentElement || this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;
	
	if(uri && prefix == null){
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if(prefix == null){
			//isHTML = true;
			var visibleNamespaces=[
			{namespace:uri,prefix:null}
			//{namespace:uri,prefix:''}
			]
		}
	}
	serializeToString(this,buf,isHtml,nodeFilter,visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node,isHTML, visibleNamespaces) {
	var prefix = node.prefix||'';
	var uri = node.namespaceURI;
	if (!prefix && !uri){
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" 
		|| uri == 'http://www.w3.org/2000/xmlns/'){
		return false;
	}
	
	var i = visibleNamespaces.length 
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix){
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node,buf,isHTML,nodeFilter,visibleNamespaces){
	if(nodeFilter){
		node = nodeFilter(node);
		if(node){
			if(typeof node == 'string'){
				buf.push(node);
				return;
			}
		}else{
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch(node.nodeType){
	case ELEMENT_NODE:
		if (!visibleNamespaces) visibleNamespaces = [];
		var startVisibleNamespaces = visibleNamespaces.length;
		var attrs = node.attributes;
		var len = attrs.length;
		var child = node.firstChild;
		var nodeName = node.tagName;
		
		isHTML =  (htmlns === node.namespaceURI) ||isHTML 
		buf.push('<',nodeName);
		
		
		
		for(var i=0;i<len;i++){
			// add namespaces for attributes
			var attr = attrs.item(i);
			if (attr.prefix == 'xmlns') {
				visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
			}else if(attr.nodeName == 'xmlns'){
				visibleNamespaces.push({ prefix: '', namespace: attr.value });
			}
		}
		for(var i=0;i<len;i++){
			var attr = attrs.item(i);
			if (needNamespaceDefine(attr,isHTML, visibleNamespaces)) {
				var prefix = attr.prefix||'';
				var uri = attr.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="' , uri , '"');
				visibleNamespaces.push({ prefix: prefix, namespace:uri });
			}
			serializeToString(attr,buf,isHTML,nodeFilter,visibleNamespaces);
		}
		// add namespace for current node		
		if (needNamespaceDefine(node,isHTML, visibleNamespaces)) {
			var prefix = node.prefix||'';
			var uri = node.namespaceURI;
			var ns = prefix ? ' xmlns:' + prefix : " xmlns";
			buf.push(ns, '="' , uri , '"');
			visibleNamespaces.push({ prefix: prefix, namespace:uri });
		}
		
		if(child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)){
			buf.push('>');
			//if is cdata child node
			if(isHTML && /^script$/i.test(nodeName)){
				while(child){
					if(child.data){
						buf.push(child.data);
					}else{
						serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					}
					child = child.nextSibling;
				}
			}else
			{
				while(child){
					serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
					child = child.nextSibling;
				}
			}
			buf.push('</',nodeName,'>');
		}else{
			buf.push('/>');
		}
		// remove added visible namespaces
		//visibleNamespaces.length = startVisibleNamespaces;
		return;
	case DOCUMENT_NODE:
	case DOCUMENT_FRAGMENT_NODE:
		var child = node.firstChild;
		while(child){
			serializeToString(child,buf,isHTML,nodeFilter,visibleNamespaces);
			child = child.nextSibling;
		}
		return;
	case ATTRIBUTE_NODE:
		return buf.push(' ',node.name,'="',node.value.replace(/[<&"]/g,_xmlEncoder),'"');
	case TEXT_NODE:
		return buf.push(node.data.replace(/[<&]/g,_xmlEncoder));
	case CDATA_SECTION_NODE:
		return buf.push( '<![CDATA[',node.data,']]>');
	case COMMENT_NODE:
		return buf.push( "<!--",node.data,"-->");
	case DOCUMENT_TYPE_NODE:
		var pubid = node.publicId;
		var sysid = node.systemId;
		buf.push('<!DOCTYPE ',node.name);
		if(pubid){
			buf.push(' PUBLIC "',pubid);
			if (sysid && sysid!='.') {
				buf.push( '" "',sysid);
			}
			buf.push('">');
		}else if(sysid && sysid!='.'){
			buf.push(' SYSTEM "',sysid,'">');
		}else{
			var sub = node.internalSubset;
			if(sub){
				buf.push(" [",sub,"]");
			}
			buf.push(">");
		}
		return;
	case PROCESSING_INSTRUCTION_NODE:
		return buf.push( "<?",node.target," ",node.data,"?>");
	case ENTITY_REFERENCE_NODE:
		return buf.push( '&',node.nodeName,';');
	//case ENTITY_NODE:
	//case NOTATION_NODE:
	default:
		buf.push('??',node.nodeName);
	}
}
function importNode(doc,node,deep){
	var node2;
	switch (node.nodeType) {
	case ELEMENT_NODE:
		node2 = node.cloneNode(false);
		node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
			//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
	case DOCUMENT_FRAGMENT_NODE:
		break;
	case ATTRIBUTE_NODE:
		deep = true;
		break;
	//case ENTITY_REFERENCE_NODE:
	//case PROCESSING_INSTRUCTION_NODE:
	////case TEXT_NODE:
	//case CDATA_SECTION_NODE:
	//case COMMENT_NODE:
	//	deep = false;
	//	break;
	//case DOCUMENT_NODE:
	//case DOCUMENT_TYPE_NODE:
	//cannot be imported.
	//case ENTITY_NODE:
	//case NOTATION_NODE：
	//can not hit in level3
	//default:throw e;
	}
	if(!node2){
		node2 = node.cloneNode(false);//false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(importNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function cloneNode(doc,node,deep){
	var node2 = new node.constructor();
	for(var n in node){
		var v = node[n];
		if(typeof v != 'object' ){
			if(v != node2[n]){
				node2[n] = v;
			}
		}
	}
	if(node.childNodes){
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
	case ELEMENT_NODE:
		var attrs	= node.attributes;
		var attrs2	= node2.attributes = new NamedNodeMap();
		var len = attrs.length
		attrs2._ownerElement = node2;
		for(var i=0;i<len;i++){
			node2.setAttributeNode(cloneNode(doc,attrs.item(i),true));
		}
		break;;
	case ATTRIBUTE_NODE:
		deep = true;
	}
	if(deep){
		var child = node.firstChild;
		while(child){
			node2.appendChild(cloneNode(doc,child,deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object,key,value){
	object[key] = value
}
//do dynamic
try{
	if(Object.defineProperty){
		Object.defineProperty(LiveNodeList.prototype,'length',{
			get:function(){
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype,'textContent',{
			get:function(){
				return getTextContent(this);
			},
			set:function(data){
				switch(this.nodeType){
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					while(this.firstChild){
						this.removeChild(this.firstChild);
					}
					if(data || String(data)){
						this.appendChild(this.ownerDocument.createTextNode(data));
					}
					break;
				default:
					//TODO:
					this.data = data;
					this.value = data;
					this.nodeValue = data;
				}
			}
		})
		
		function getTextContent(node){
			switch(node.nodeType){
			case ELEMENT_NODE:
			case DOCUMENT_FRAGMENT_NODE:
				var buf = [];
				node = node.firstChild;
				while(node){
					if(node.nodeType!==7 && node.nodeType !==8){
						buf.push(getTextContent(node));
					}
					node = node.nextSibling;
				}
				return buf.join('');
			default:
				return node.nodeValue;
			}
		}
		__set__ = function(object,key,value){
			//console.log(value)
			object['$$'+key] = value
		}
	}
}catch(e){//ie8
}

//if(typeof require == 'function'){
	exports.DOMImplementation = DOMImplementation;
	exports.XMLSerializer = XMLSerializer;
//}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/xmldom/entities.js":
/*!*********************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/xmldom/entities.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

exports.entityMap = {
       lt: '<',
       gt: '>',
       amp: '&',
       quot: '"',
       apos: "'",
       Agrave: "À",
       Aacute: "Á",
       Acirc: "Â",
       Atilde: "Ã",
       Auml: "Ä",
       Aring: "Å",
       AElig: "Æ",
       Ccedil: "Ç",
       Egrave: "È",
       Eacute: "É",
       Ecirc: "Ê",
       Euml: "Ë",
       Igrave: "Ì",
       Iacute: "Í",
       Icirc: "Î",
       Iuml: "Ï",
       ETH: "Ð",
       Ntilde: "Ñ",
       Ograve: "Ò",
       Oacute: "Ó",
       Ocirc: "Ô",
       Otilde: "Õ",
       Ouml: "Ö",
       Oslash: "Ø",
       Ugrave: "Ù",
       Uacute: "Ú",
       Ucirc: "Û",
       Uuml: "Ü",
       Yacute: "Ý",
       THORN: "Þ",
       szlig: "ß",
       agrave: "à",
       aacute: "á",
       acirc: "â",
       atilde: "ã",
       auml: "ä",
       aring: "å",
       aelig: "æ",
       ccedil: "ç",
       egrave: "è",
       eacute: "é",
       ecirc: "ê",
       euml: "ë",
       igrave: "ì",
       iacute: "í",
       icirc: "î",
       iuml: "ï",
       eth: "ð",
       ntilde: "ñ",
       ograve: "ò",
       oacute: "ó",
       ocirc: "ô",
       otilde: "õ",
       ouml: "ö",
       oslash: "ø",
       ugrave: "ù",
       uacute: "ú",
       ucirc: "û",
       uuml: "ü",
       yacute: "ý",
       thorn: "þ",
       yuml: "ÿ",
       nbsp: " ",
       iexcl: "¡",
       cent: "¢",
       pound: "£",
       curren: "¤",
       yen: "¥",
       brvbar: "¦",
       sect: "§",
       uml: "¨",
       copy: "©",
       ordf: "ª",
       laquo: "«",
       not: "¬",
       shy: "­­",
       reg: "®",
       macr: "¯",
       deg: "°",
       plusmn: "±",
       sup2: "²",
       sup3: "³",
       acute: "´",
       micro: "µ",
       para: "¶",
       middot: "·",
       cedil: "¸",
       sup1: "¹",
       ordm: "º",
       raquo: "»",
       frac14: "¼",
       frac12: "½",
       frac34: "¾",
       iquest: "¿",
       times: "×",
       divide: "÷",
       forall: "∀",
       part: "∂",
       exist: "∃",
       empty: "∅",
       nabla: "∇",
       isin: "∈",
       notin: "∉",
       ni: "∋",
       prod: "∏",
       sum: "∑",
       minus: "−",
       lowast: "∗",
       radic: "√",
       prop: "∝",
       infin: "∞",
       ang: "∠",
       and: "∧",
       or: "∨",
       cap: "∩",
       cup: "∪",
       'int': "∫",
       there4: "∴",
       sim: "∼",
       cong: "≅",
       asymp: "≈",
       ne: "≠",
       equiv: "≡",
       le: "≤",
       ge: "≥",
       sub: "⊂",
       sup: "⊃",
       nsub: "⊄",
       sube: "⊆",
       supe: "⊇",
       oplus: "⊕",
       otimes: "⊗",
       perp: "⊥",
       sdot: "⋅",
       Alpha: "Α",
       Beta: "Β",
       Gamma: "Γ",
       Delta: "Δ",
       Epsilon: "Ε",
       Zeta: "Ζ",
       Eta: "Η",
       Theta: "Θ",
       Iota: "Ι",
       Kappa: "Κ",
       Lambda: "Λ",
       Mu: "Μ",
       Nu: "Ν",
       Xi: "Ξ",
       Omicron: "Ο",
       Pi: "Π",
       Rho: "Ρ",
       Sigma: "Σ",
       Tau: "Τ",
       Upsilon: "Υ",
       Phi: "Φ",
       Chi: "Χ",
       Psi: "Ψ",
       Omega: "Ω",
       alpha: "α",
       beta: "β",
       gamma: "γ",
       delta: "δ",
       epsilon: "ε",
       zeta: "ζ",
       eta: "η",
       theta: "θ",
       iota: "ι",
       kappa: "κ",
       lambda: "λ",
       mu: "μ",
       nu: "ν",
       xi: "ξ",
       omicron: "ο",
       pi: "π",
       rho: "ρ",
       sigmaf: "ς",
       sigma: "σ",
       tau: "τ",
       upsilon: "υ",
       phi: "φ",
       chi: "χ",
       psi: "ψ",
       omega: "ω",
       thetasym: "ϑ",
       upsih: "ϒ",
       piv: "ϖ",
       OElig: "Œ",
       oelig: "œ",
       Scaron: "Š",
       scaron: "š",
       Yuml: "Ÿ",
       fnof: "ƒ",
       circ: "ˆ",
       tilde: "˜",
       ensp: " ",
       emsp: " ",
       thinsp: " ",
       zwnj: "‌",
       zwj: "‍",
       lrm: "‎",
       rlm: "‏",
       ndash: "–",
       mdash: "—",
       lsquo: "‘",
       rsquo: "’",
       sbquo: "‚",
       ldquo: "“",
       rdquo: "”",
       bdquo: "„",
       dagger: "†",
       Dagger: "‡",
       bull: "•",
       hellip: "…",
       permil: "‰",
       prime: "′",
       Prime: "″",
       lsaquo: "‹",
       rsaquo: "›",
       oline: "‾",
       euro: "€",
       trade: "™",
       larr: "←",
       uarr: "↑",
       rarr: "→",
       darr: "↓",
       harr: "↔",
       crarr: "↵",
       lceil: "⌈",
       rceil: "⌉",
       lfloor: "⌊",
       rfloor: "⌋",
       loz: "◊",
       spades: "♠",
       clubs: "♣",
       hearts: "♥",
       diams: "♦"
};
//for(var  n in exports.entityMap){console.log(exports.entityMap[n].charCodeAt())}

/***/ }),

/***/ "./templates/cocos2-adapter-modified/common/xmldom/sax.js":
/*!****************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/common/xmldom/sax.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]///\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9"+nameStartChar.source.slice(1,-1)+"\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^'+nameStartChar.source+nameChar.source+'*(?:\:'+nameStartChar.source+nameChar.source+'*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0;//tag name offerring
var S_ATTR = 1;//attr name offerring 
var S_ATTR_SPACE=2;//attr name end and space offer
var S_EQ = 3;//=space?
var S_ATTR_NOQUOT_VALUE = 4;//attr value(no quot value only)
var S_ATTR_END = 5;//attr value end and no space(quot end)
var S_TAG_SPACE = 6;//(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7;//closed el<el />

function XMLReader(){
	
}

XMLReader.prototype = {
	parse:function(source,defaultNSMap,entityMap){
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap ,defaultNSMap = {})
		parse(source,defaultNSMap,entityMap,
				domBuilder,this.errorHandler);
		domBuilder.endDocument();
	}
}
function parse(source,defaultNSMapCopy,entityMap,domBuilder,errorHandler){
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10)
				, surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a){
		var k = a.slice(1,-1);
		if(k in entityMap){
			return entityMap[k]; 
		}else if(k.charAt(0) === '#'){
			return fixedFromCharCode(parseInt(k.substr(1).replace('x','0x')))
		}else{
			errorHandler.error('entity not found:'+a);
			return a;
		}
	}
	function appendText(end){//has some bugs
		if(end>start){
			var xt = source.substring(start,end).replace(/&#?\w+;/g,entityReplacer);
			locator&&position(start);
			domBuilder.characters(xt,0,end-start);
			start = end
		}
	}
	function position(p,m){
		while(p>=lineEnd && (m = linePattern.exec(source))){
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p-lineStart+1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g
	var locator = domBuilder.locator;
	
	var parseStack = [{currentNSMap:defaultNSMapCopy}]
	var closeMap = {};
	var start = 0;
	while(true){
		try{
			var tagStart = source.indexOf('<',start);
			if(tagStart<0){
				if(!source.substr(start).match(/^\s*$/)){
					var doc = domBuilder.doc;
	    			var text = doc.createTextNode(source.substr(start));
	    			doc.appendChild(text);
	    			domBuilder.currentElement = text;
				}
				return;
			}
			if(tagStart>start){
				appendText(tagStart);
			}
			switch(source.charAt(tagStart+1)){
			case '/':
				var end = source.indexOf('>',tagStart+3);
				var tagName = source.substring(tagStart+2,end);
				var config = parseStack.pop();
				if(end<0){
					
	        		tagName = source.substring(tagStart+2).replace(/[\s<].*/,'');
	        		//console.error('#@@@@@@'+tagName)
	        		errorHandler.error("end tag name: "+tagName+' is not complete:'+config.tagName);
	        		end = tagStart+1+tagName.length;
	        	}else if(tagName.match(/\s</)){
	        		tagName = tagName.replace(/[\s<].*/,'');
	        		errorHandler.error("end tag name: "+tagName+' maybe not complete');
	        		end = tagStart+1+tagName.length;
				}
				//console.error(parseStack.length,parseStack)
				//console.error(config);
				var localNSMap = config.localNSMap;
				var endMatch = config.tagName == tagName;
				var endIgnoreCaseMach = endMatch || config.tagName&&config.tagName.toLowerCase() == tagName.toLowerCase()
		        if(endIgnoreCaseMach){
		        	domBuilder.endElement(config.uri,config.localName,tagName);
					if(localNSMap){
						for(var prefix in localNSMap){
							domBuilder.endPrefixMapping(prefix) ;
						}
					}
					if(!endMatch){
		            	errorHandler.fatalError("end tag name: "+tagName+' is not match the current start tagName:'+config.tagName );
					}
		        }else{
		        	parseStack.push(config)
		        }
				
				end++;
				break;
				// end elment
			case '?':// <?...?>
				locator&&position(tagStart);
				end = parseInstruction(source,tagStart,domBuilder);
				break;
			case '!':// <!doctype,<![CDATA,<!--
				locator&&position(tagStart);
				end = parseDCC(source,tagStart,domBuilder,errorHandler);
				break;
			default:
				locator&&position(tagStart);
				var el = new ElementAttributes();
				var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
				//elStartEnd
				var end = parseElementStartPart(source,tagStart,el,currentNSMap,entityReplacer,errorHandler);
				var len = el.length;
				
				
				if(!el.closed && fixSelfClosed(source,end,el.tagName,closeMap)){
					el.closed = true;
					if(!entityMap.nbsp){
						errorHandler.warning('unclosed xml attribute');
					}
				}
				if(locator && len){
					var locator2 = copyLocator(locator,{});
					//try{//attribute position fixed
					for(var i = 0;i<len;i++){
						var a = el[i];
						position(a.offset);
						a.locator = copyLocator(locator,{});
					}
					//}catch(e){console.error('@@@@@'+e)}
					domBuilder.locator = locator2
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
					domBuilder.locator = locator;
				}else{
					if(appendElement(el,domBuilder,currentNSMap)){
						parseStack.push(el)
					}
				}
				
				
				
				if(el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed){
					end = parseHtmlSpecialContent(source,end,el.tagName,entityReplacer,domBuilder)
				}else{
					end++;
				}
			}
		}catch(e){
			errorHandler.error('element parse error: '+e)
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if(end>start){
			start = end;
		}else{
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart,start)+1);
		}
	}
}
function copyLocator(f,t){
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source,start,el,currentNSMap,entityReplacer,errorHandler){
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG;//status
	while(true){
		var c = source.charAt(p);
		switch(c){
		case '=':
			if(s === S_ATTR){//attrName
				attrName = source.slice(start,p);
				s = S_EQ;
			}else if(s === S_ATTR_SPACE){
				s = S_EQ;
			}else{
				//fatalError: equal must after attrName or space after attrName
				throw new Error('attribute equal must after attrName');
			}
			break;
		case '\'':
		case '"':
			if(s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				){//equal
				if(s === S_ATTR){
					errorHandler.warning('attribute value must after "="')
					attrName = source.slice(start,p)
				}
				start = p+1;
				p = source.indexOf(c,start)
				if(p>0){
					value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					el.add(attrName,value,start-1);
					s = S_ATTR_END;
				}else{
					//fatalError: no end quot match
					throw new Error('attribute value no end \''+c+'\' match');
				}
			}else if(s == S_ATTR_NOQUOT_VALUE){
				value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
				//console.log(attrName,value,start,p)
				el.add(attrName,value,start);
				//console.dir(el)
				errorHandler.warning('attribute "'+attrName+'" missed start quot('+c+')!!');
				start = p+1;
				s = S_ATTR_END
			}else{
				//fatalError: no equal before
				throw new Error('attribute value must after "="');
			}
			break;
		case '/':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				s =S_TAG_CLOSE;
				el.closed = true;
			case S_ATTR_NOQUOT_VALUE:
			case S_ATTR:
			case S_ATTR_SPACE:
				break;
			//case S_EQ:
			default:
				throw new Error("attribute invalid close char('/')")
			}
			break;
		case ''://end document
			//throw new Error('unexpected end of input')
			errorHandler.error('unexpected end of input');
			if(s == S_TAG){
				el.setTagName(source.slice(start,p));
			}
			return p;
		case '>':
			switch(s){
			case S_TAG:
				el.setTagName(source.slice(start,p));
			case S_ATTR_END:
			case S_TAG_SPACE:
			case S_TAG_CLOSE:
				break;//normal
			case S_ATTR_NOQUOT_VALUE://Compatible state
			case S_ATTR:
				value = source.slice(start,p);
				if(value.slice(-1) === '/'){
					el.closed  = true;
					value = value.slice(0,-1)
				}
			case S_ATTR_SPACE:
				if(s === S_ATTR_SPACE){
					value = attrName;
				}
				if(s == S_ATTR_NOQUOT_VALUE){
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value.replace(/&#?\w+;/g,entityReplacer),start)
				}else{
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+value+'" missed value!! "'+value+'" instead!!')
					}
					el.add(value,value,start)
				}
				break;
			case S_EQ:
				throw new Error('attribute value missed!!');
			}
//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
			return p;
		/*xml space '\x20' | #x9 | #xD | #xA; */
		case '\u0080':
			c = ' ';
		default:
			if(c<= ' '){//space
				switch(s){
				case S_TAG:
					el.setTagName(source.slice(start,p));//tagName
					s = S_TAG_SPACE;
					break;
				case S_ATTR:
					attrName = source.slice(start,p)
					s = S_ATTR_SPACE;
					break;
				case S_ATTR_NOQUOT_VALUE:
					var value = source.slice(start,p).replace(/&#?\w+;/g,entityReplacer);
					errorHandler.warning('attribute "'+value+'" missed quot(")!!');
					el.add(attrName,value,start)
				case S_ATTR_END:
					s = S_TAG_SPACE;
					break;
				//case S_TAG_SPACE:
				//case S_EQ:
				//case S_ATTR_SPACE:
				//	void();break;
				//case S_TAG_CLOSE:
					//ignore warning
				}
			}else{//not space
//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
				switch(s){
				//case S_TAG:void();break;
				//case S_ATTR:void();break;
				//case S_ATTR_NOQUOT_VALUE:void();break;
				case S_ATTR_SPACE:
					var tagName =  el.tagName;
					if(currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)){
						errorHandler.warning('attribute "'+attrName+'" missed value!! "'+attrName+'" instead2!!')
					}
					el.add(attrName,attrName,start);
					start = p;
					s = S_ATTR;
					break;
				case S_ATTR_END:
					errorHandler.warning('attribute space is required"'+attrName+'"!!')
				case S_TAG_SPACE:
					s = S_ATTR;
					start = p;
					break;
				case S_EQ:
					s = S_ATTR_NOQUOT_VALUE;
					start = p;
					break;
				case S_TAG_CLOSE:
					throw new Error("elements closed character '/' and '>' must be connected to");
				}
			}
		}//end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el,domBuilder,currentNSMap){
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while(i--){
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if(nsp>0){
			var prefix = a.prefix = qName.slice(0,nsp);
			var localName = qName.slice(nsp+1);
			var nsPrefix = prefix === 'xmlns' && localName
		}else{
			localName = qName;
			prefix = null
			nsPrefix = qName === 'xmlns' && ''
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName ;
		//prefix == null for no ns prefix attribute 
		if(nsPrefix !== false){//hack!!
			if(localNSMap == null){
				localNSMap = {}
				//console.log(currentNSMap,0)
				_copy(currentNSMap,currentNSMap={})
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/'
			domBuilder.startPrefixMapping(nsPrefix, value) 
		}
	}
	var i = el.length;
	while(i--){
		a = el[i];
		var prefix = a.prefix;
		if(prefix){//no prefix attribute has no namespace
			if(prefix === 'xml'){
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if(prefix !== 'xmlns'){
				a.uri = currentNSMap[prefix || '']
				
				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if(nsp>0){
		prefix = el.prefix = tagName.slice(0,nsp);
		localName = el.localName = tagName.slice(nsp+1);
	}else{
		prefix = null;//important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns,localName,tagName,el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if(el.closed){
		domBuilder.endElement(ns,localName,tagName);
		if(localNSMap){
			for(prefix in localNSMap){
				domBuilder.endPrefixMapping(prefix) 
			}
		}
	}else{
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source,elStartEnd,tagName,entityReplacer,domBuilder){
	if(/^(?:script|textarea)$/i.test(tagName)){
		var elEndStart =  source.indexOf('</'+tagName+'>',elStartEnd);
		var text = source.substring(elStartEnd+1,elEndStart);
		if(/[&<]/.test(text)){
			if(/^script$/i.test(tagName)){
				//if(!/\]\]>/.test(text)){
					//lexHandler.startCDATA();
					domBuilder.characters(text,0,text.length);
					//lexHandler.endCDATA();
					return elEndStart;
				//}
			}//}else{//text area
				text = text.replace(/&#?\w+;/g,entityReplacer);
				domBuilder.characters(text,0,text.length);
				return elEndStart;
			//}
			
		}
	}
	return elStartEnd+1;
}
function fixSelfClosed(source,elStartEnd,tagName,closeMap){
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if(pos == null){
		//console.log(tagName)
		pos =  source.lastIndexOf('</'+tagName+'>')
		if(pos<elStartEnd){//忘记闭合
			pos = source.lastIndexOf('</'+tagName)
		}
		closeMap[tagName] =pos
	}
	return pos<elStartEnd;
	//} 
}
function _copy(source,target){
	for(var n in source){target[n] = source[n]}
}
function parseDCC(source,start,domBuilder,errorHandler){//sure start with '<!'
	var next= source.charAt(start+2)
	switch(next){
	case '-':
		if(source.charAt(start + 3) === '-'){
			var end = source.indexOf('-->',start+4);
			//append comment source.substring(4,end)//<!--
			if(end>start){
				domBuilder.comment(source,start+4,end-start-4);
				return end+3;
			}else{
				errorHandler.error("Unclosed comment");
				return -1;
			}
		}else{
			//error
			return -1;
		}
	default:
		if(source.substr(start+3,6) == 'CDATA['){
			var end = source.indexOf(']]>',start+9);
			domBuilder.startCDATA();
			domBuilder.characters(source,start+9,end-start-9);
			domBuilder.endCDATA() 
			return end+3;
		}
		//<!DOCTYPE
		//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
		var matchs = split(source,start);
		var len = matchs.length;
		if(len>1 && /!doctype/i.test(matchs[0][0])){
			var name = matchs[1][0];
			var pubid = len>3 && /^public$/i.test(matchs[2][0]) && matchs[3][0]
			var sysid = len>4 && matchs[4][0];
			var lastMatch = matchs[len-1]
			domBuilder.startDTD(name,pubid && pubid.replace(/^(['"])(.*?)\1$/,'$2'),
					sysid && sysid.replace(/^(['"])(.*?)\1$/,'$2'));
			domBuilder.endDTD();
			
			return lastMatch.index+lastMatch[0].length
		}
	}
	return -1;
}



function parseInstruction(source,start,domBuilder){
	var end = source.indexOf('?>',start);
	if(end){
		var match = source.substring(start,end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if(match){
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]) ;
			return end+2;
		}else{//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source){
	
}
ElementAttributes.prototype = {
	setTagName:function(tagName){
		if(!tagNamePattern.test(tagName)){
			throw new Error('invalid tagName:'+tagName)
		}
		this.tagName = tagName
	},
	add:function(qName,value,offset){
		if(!tagNamePattern.test(qName)){
			throw new Error('invalid attribute:'+qName)
		}
		this[this.length++] = {qName:qName,value:value,offset:offset}
	},
	length:0,
	getLocalName:function(i){return this[i].localName},
	getLocator:function(i){return this[i].locator},
	getQName:function(i){return this[i].qName},
	getURI:function(i){return this[i].uri},
	getValue:function(i){return this[i].value}
//	,getIndex:function(uri, localName)){
//		if(localName){
//			
//		}else{
//			var qName = uri
//		}
//	},
//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
//	getType:function(uri,localName){}
//	getType:function(i){},
}



function split(source,start){
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source);//skip <
	while(match = reg.exec(source)){
		buf.push(match);
		if(match[1])return buf;
	}
}

exports.XMLReader = XMLReader;



/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Audio.js":
/*!*************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Audio.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Audio)
/* harmony export */ });
/* harmony import */ var _HTMLAudioElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HTMLAudioElement */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLAudioElement.js");


const HAVE_NOTHING = 0
const HAVE_METADATA = 1
const HAVE_CURRENT_DATA = 2
const HAVE_FUTURE_DATA = 3
const HAVE_ENOUGH_DATA = 4

let SN_SEED = 1

const _innerAudioContextMap = {}

class Audio extends _HTMLAudioElement__WEBPACK_IMPORTED_MODULE_0__["default"] {

  constructor(url) {
    super()

    this._$sn = SN_SEED++;

    this.HAVE_NOTHING = HAVE_NOTHING
    this.HAVE_METADATA = HAVE_METADATA
    this.HAVE_CURRENT_DATA = HAVE_CURRENT_DATA
    this.HAVE_FUTURE_DATA = HAVE_FUTURE_DATA
    this.HAVE_ENOUGH_DATA = HAVE_ENOUGH_DATA
    
    this.readyState = HAVE_NOTHING

    const innerAudioContext = my.createInnerAudioContext()

    _innerAudioContextMap[this._$sn] = innerAudioContext

    this._canplayEvents = [
      'load',
      'loadend',
      'canplay',
      'canplaythrough',
      'loadedmetadata'
    ]

    innerAudioContext.onCanplay(() => {
      this._loaded = true
      this.readyState = this.HAVE_CURRENT_DATA
      this._canplayEvents.forEach((type) => {
          this.dispatchEvent({ type: type })
      })
    })
    innerAudioContext.onPlay(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused
      this.dispatchEvent({ type: 'play' })
    })
    innerAudioContext.onPause(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused
      this.dispatchEvent({ type: 'pause' })
    })
    innerAudioContext.onEnded(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused
      if (_innerAudioContextMap[this._$sn].loop === false) {
          this.dispatchEvent({ type: 'ended' })
      }
      this.readyState = HAVE_ENOUGH_DATA
    })
    innerAudioContext.onError(() => {
      this._paused = _innerAudioContextMap[this._$sn].paused
      this.dispatchEvent({ type: 'error' })
    })

    if (url) {
      this.src = url
    } else {
        this._src = ''
    }

    this._loop = innerAudioContext.loop
    this._autoplay = innerAudioContext.autoplay
    this._paused = innerAudioContext.paused
    this._volume = innerAudioContext.volume
    this._muted = false;
  }
  
  addEventListener(type, listener, options = {}) {
    super.addEventListener(type, listener, options)

    type = String(type).toLowerCase()

    if (this._loaded && this._canplayEvents.indexOf(type) !== -1) {
        this.dispatchEvent({ type: type })
    }
  }

  load() {
    // console.warn('HTMLAudioElement.load() is not implemented.')
    // weixin doesn't need call load() manually
  }

  play() {
    _innerAudioContextMap[this._$sn].play()
  }

  resume() {
    _innerAudioContextMap[this._$sn].resume()
  }

  pause() {
    _innerAudioContextMap[this._$sn].pause()
  }

  stop() {
      _innerAudioContextMap[this._$sn].stop()
  }

  destroy() {
    _innerAudioContextMap[this._$sn].destroy()
  }

  canPlayType(mediaType = '') {
    if (typeof mediaType !== 'string') {
      return ''
    }

    if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
      return 'probably'
    }
    return ''
  }

  get currentTime() {
    return _innerAudioContextMap[this._$sn].currentTime
  }

  set currentTime(value) {
    _innerAudioContextMap[this._$sn].seek(value)
  }

  get duration () {
    return _innerAudioContextMap[this._$sn].duration
  }

  get src() {
    return this._src
  }

  set src(value) {
    this._src = value
    this._loaded = false
    this.readyState = this.HAVE_NOTHING

    const innerAudioContext = _innerAudioContextMap[this._$sn]
    
    innerAudioContext.src = value
  }

  get loop() {
    return this._loop
  }

  set loop(value) {
    this._loop = value
    _innerAudioContextMap[this._$sn].loop = value
  }

  get autoplay() {
    return this.autoplay
  }

  set autoplay(value) {
    this._autoplay = value
    _innerAudioContextMap[this._$sn].autoplay = value
  }

  get paused() {
    return this._paused;
  }

  get volume() {
    return this._volume;
  }

  set volume(value) {
    this._volume = value;
    if (!this._muted) {
      _innerAudioContextMap[this._$sn].volume = value;
    }
  }

  get muted() {
    return this._muted;
  }

  set muted(value) {
    this._muted = value;
    if (value) {
      _innerAudioContextMap[this._$sn].volume = 0;
    } else {
      _innerAudioContextMap[this._$sn].volume = this._volume;
    }
  }

  cloneNode() {
    const newAudio = new Audio()
    newAudio.loop = this.loop
    newAudio.autoplay = this.autoplay
    newAudio.src = this.src
    return newAudio
  }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Canvas.js":
/*!**************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Canvas.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _WindowProperties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WindowProperties */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WindowProperties.js");
var window = $global;



function Canvas () {}

let CanvasProxy = new Proxy(Canvas, {
  construct () {

    const canvas = my.createOffscreenCanvas()

    canvas.type = 'canvas'
  
    // canvas.__proto__.__proto__.__proto__ = new HTMLCanvasElement()
  
    const _getContext = canvas.getContext
  
    canvas.getBoundingClientRect = () => {
      const ret = {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      }
      return ret
    }
  
    canvas.style = {
      top: '0px',
      left: '0px',
      width: _WindowProperties__WEBPACK_IMPORTED_MODULE_0__.innerWidth + 'px',
      height: _WindowProperties__WEBPACK_IMPORTED_MODULE_0__.innerHeight + 'px',
    }
  
    canvas.addEventListener = function (type, listener, options = {}) {
      // console.log('canvas.addEventListener', type);
      $global.document.addEventListener(type, listener, options);
    }
  
    canvas.removeEventListener = function (type, listener) {
      // console.log('canvas.removeEventListener', type);
      $global.document.removeEventListener(type, listener);
    }
  
    canvas.dispatchEvent = function (event = {}) {
      console.log('canvas.dispatchEvent' , event.type, event);
      // nothing to do
    }
  
    Object.defineProperty(canvas, 'clientWidth', {
      enumerable: true,
      get: function get() {
        return _WindowProperties__WEBPACK_IMPORTED_MODULE_0__.innerWidth
      }
    })
  
    Object.defineProperty(canvas, 'clientHeight', {
      enumerable: true,
      get: function get() {
        return _WindowProperties__WEBPACK_IMPORTED_MODULE_0__.innerHeight
      }
    })
  
    return canvas
  },
});

// NOTE: this is a hack operation
// let canvas = new window.Canvas()
// console.error(canvas instanceof window.Canvas)  => false
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (CanvasProxy);


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Element.js":
/*!***************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Element.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Element)
/* harmony export */ });
/* harmony import */ var _Node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Node */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Node.js");


class Element extends _Node__WEBPACK_IMPORTED_MODULE_0__["default"] {
  className = ''
  children = []

  constructor() {
    super()
  }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/EventTarget.js":
/*!*******************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/EventTarget.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EventTarget)
/* harmony export */ });
const _events = new WeakMap()

class EventTarget {
  constructor() {
    _events.set(this, {})
  }

  addEventListener(type, listener, options = {}) {
    let events = _events.get(this)

    if (!events) {
      events = {}
      _events.set(this, events)
    }
    if (!events[type]) {
      events[type] = []
    }
    events[type].push(listener)

    if (options.capture) {
      // console.warn('EventTarget.addEventListener: options.capture is not implemented.')
    }
    if (options.once) {
      // console.warn('EventTarget.addEventListener: options.once is not implemented.')
    }
    if (options.passive) {
      // console.warn('EventTarget.addEventListener: options.passive is not implemented.')
    }
  }

  removeEventListener(type, listener) {
    const events = _events.get(this)

    if (events) {
      const listeners = events[type]

      if (listeners && listeners.length > 0) {
          for (let i = listeners.length; i--; i > 0) {
              if (listeners[i] === listener) {
                  listeners.splice(i, 1)
                  break
              }
          }
      }
    }
  }

  dispatchEvent(event = {}) {
    const listeners = _events.get(this)[event.type]

    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event)
      }
    }
  }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLAudioElement.js":
/*!************************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLAudioElement.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HTMLAudioElement)
/* harmony export */ });
/* harmony import */ var _HTMLElement__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HTMLElement */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLElement.js");


class HTMLAudioElement extends _HTMLElement__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super('audio')
  }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLCanvasElement.js":
/*!*************************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLCanvasElement.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let HTMLCanvasElement = my.createOffscreenCanvas().constructor;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTMLCanvasElement);


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLElement.js":
/*!*******************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLElement.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HTMLElement)
/* harmony export */ });
/* harmony import */ var _Element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Element.js");
/* harmony import */ var _util_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/index.js */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/util/index.js");
/* harmony import */ var _WindowProperties__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WindowProperties */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WindowProperties.js");




class HTMLElement extends _Element__WEBPACK_IMPORTED_MODULE_0__["default"] {
  className = ''
  childern = []
  style = {
    width: `${_WindowProperties__WEBPACK_IMPORTED_MODULE_2__.innerWidth}px`,
    height: `${_WindowProperties__WEBPACK_IMPORTED_MODULE_2__.innerHeight}px`
  }

  insertBefore = _util_index_js__WEBPACK_IMPORTED_MODULE_1__.noop

  innerHTML = ''

  constructor(tagName = '') {
    super()
    this.tagName = tagName.toUpperCase()
  }

  setAttribute(name, value) {
    this[name] = value
  }

  getAttribute(name) {
    return this[name]
  }

  get clientWidth() {
    const ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length

    return Number.isNaN(ret) ? 0 : ret
  }

  get clientHeight() {
    const ret = parseInt(this.style.fontSize, 10)

    return Number.isNaN(ret) ? 0 : ret
  }

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: _WindowProperties__WEBPACK_IMPORTED_MODULE_2__.innerWidth,
      height: _WindowProperties__WEBPACK_IMPORTED_MODULE_2__.innerHeight
    }
  }

  focus() {

  }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLImageElement.js":
/*!************************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLImageElement.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var screencanvas = $global.screencanvas;
let HTMLImageElement =  screencanvas.createImage().constructor;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (HTMLImageElement);

/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Image.js":
/*!*************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Image.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var screencanvas = $global.screencanvas;

function Image () {
    // empty constructor
}
let ImageProxy = new Proxy(Image, {
    construct (target, args) {
        let img =  screencanvas.createImage();
        if (!img.addEventListener) {
            img.addEventListener = function (eventName, eventCB) {
                if (eventName === 'load') {
                    img.onload = eventCB;
                } else if (eventName === 'error') {
                    img.onerror = eventCB;
                }
            };
        }

        if (!img.removeEventListener) {
          img.removeEventListener = function (eventName) {
            if (eventName === 'load') {
              img.onload = null;
            } else if (eventName === 'error') {
              img.onerror = null;
            }
          };
        }
        return img;
    },
});

// NOTE: this is a hack operation
// let img = new window.Image()
// console.error(img instanceof window.Image)  => false
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageProxy);

/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/ImageBitmap.js":
/*!*******************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/ImageBitmap.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ImageBitmap)
/* harmony export */ });
class ImageBitmap {
    constructor() {
        // TODO
    }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Node.js":
/*!************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Node.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Node)
/* harmony export */ });
/* harmony import */ var _EventTarget_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventTarget.js */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/EventTarget.js");


class Node extends _EventTarget_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor() {
    super()
  }

  childNodes = []

  appendChild(node) {
    this.childNodes.push(node)
    // if (node instanceof Node) {
    //   this.childNodes.push(node)
    // } else {
    //   throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.')
    // }
  }

  cloneNode() {
    const copyNode = Object.create(this)

    Object.assign(copyNode, this)
    return copyNode
  }

  removeChild(node) {
    const index = this.childNodes.findIndex((child) => child === node)

    if (index > -1) {
      return this.childNodes.splice(index, 1)
    }
    return null
  }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WebGLRenderingContext.js":
/*!*****************************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WebGLRenderingContext.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebGLRenderingContext)
/* harmony export */ });
class WebGLRenderingContext {
    constructor() {
        // TODO
    }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WebSocket.js":
/*!*****************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WebSocket.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebSocket)
/* harmony export */ });
const _socketTask = new WeakMap()

class WebSocket {
  static CONNECTING = 0 // The connection is not yet open.
  static OPEN = 1 // The connection is open and ready to communicate.
  static CLOSING = 2 // The connection is in the process of closing.
  static CLOSED = 3 // The connection is closed or couldn't be opened.

  binaryType = '' // TODO 更新 binaryType
  bufferedAmount = 0 // TODO 更新 bufferedAmount
  extensions = ''

  onclose = null
  onerror = null
  onmessage = null
  onopen = null

  protocol = '' // TODO 小程序内目前获取不到，实际上需要根据服务器选择的 sub-protocol 返回
  readyState = 3

  constructor(url, protocols = []) {
    if (typeof url !== 'string' || !(/(^ws:\/\/)|(^wss:\/\/)/).test(url)) {
      throw new TypeError(`Failed to construct 'WebSocket': The URL '${url}' is invalid`)
    }

    this.url = url
    this.readyState = WebSocket.CONNECTING

    const socketTask = my.connectSocket({
      url,
      protocols: Array.isArray(protocols) ? protocols : [protocols],
      tcpNoDelay: true
    })

    _socketTask.set(this, socketTask)

    socketTask.onClose((res) => {
      this.readyState = WebSocket.CLOSED
      if (typeof this.onclose === 'function') {
        this.onclose(res)
      }
    })

    socketTask.onMessage((res) => {
      if (typeof this.onmessage === 'function') {
        this.onmessage(res)
      }
    })

    socketTask.onOpen(() => {
      this.readyState = WebSocket.OPEN
      if (typeof this.onopen === 'function') {
        this.onopen()
      }
    })

    socketTask.onError((res) => {
      if (typeof this.onerror === 'function') {
        this.onerror(new Error(res.errMsg))
      }
    })

    return this
  }

  close(code, reason) {
    this.readyState = WebSocket.CLOSING
    const socketTask = _socketTask.get(this)

    socketTask.close({
      code,
      reason
    })
  }

  send(data) {
    if (typeof data !== 'string' && !(data instanceof ArrayBuffer) && !ArrayBuffer.isView(data)) {
      throw new TypeError(`Failed to send message: The data ${data} is invalid`)
    }

    const socketTask = _socketTask.get(this)

    socketTask.send({
      data
    })
  }
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WindowProperties.js":
/*!************************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WindowProperties.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "innerWidth": () => (/* binding */ innerWidth),
/* harmony export */   "innerHeight": () => (/* binding */ innerHeight),
/* harmony export */   "devicePixelRatio": () => (/* binding */ devicePixelRatio),
/* harmony export */   "screen": () => (/* binding */ screen),
/* harmony export */   "performance": () => (/* binding */ performance),
/* harmony export */   "ontouchstart": () => (/* binding */ ontouchstart),
/* harmony export */   "ontouchmove": () => (/* binding */ ontouchmove),
/* harmony export */   "ontouchend": () => (/* binding */ ontouchend)
/* harmony export */ });
const { pixelRatio, windowWidth, windowHeight } = my.getSystemInfoSync()
const devicePixelRatio = pixelRatio;

let width, height;
if ($global.screencanvas.getBoundingClientRect) {
  let rect = $global.screencanvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
} else {
  width = windowWidth;
  height = windowHeight;
}
const innerWidth = width;
const innerHeight = height;

const screen = {
  width,
  height,
  availWidth: innerWidth,
  availHeight: innerHeight,
  availLeft: 0,
  availTop: 0,
}

const performance = {
  now: Date.now
};

const ontouchstart = null;
const ontouchmove = null;
const ontouchend = null;

/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/cancelAnimationFrame.js":
/*!****************************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/cancelAnimationFrame.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let screencanvas = $global.screencanvas;
let cancelAnimationFrame = screencanvas.cancelAnimationFrame.bind(screencanvas);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (cancelAnimationFrame);

/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/document.js":
/*!****************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/document.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./window */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/window.js");
/* harmony import */ var _HTMLElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HTMLElement */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLElement.js");
/* harmony import */ var _Image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Image */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Image.js");
/* harmony import */ var _Canvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Canvas */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Canvas.js");
/* harmony import */ var _Audio__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Audio */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Audio.js");






const events = {}

var document = {
  readyState: 'complete',
  visibilityState: 'visible',
  documentElement: _window__WEBPACK_IMPORTED_MODULE_0__,
  hidden: false,
  style: {},
  location: _window__WEBPACK_IMPORTED_MODULE_0__.location,
  ontouchstart: null,
  ontouchmove: null,
  ontouchend: null,

  head: new _HTMLElement__WEBPACK_IMPORTED_MODULE_1__["default"]('head'),
  body: new _HTMLElement__WEBPACK_IMPORTED_MODULE_1__["default"]('body'),

  createElement(tagName) {
    tagName = tagName.toLowerCase();
    if (tagName === 'canvas') {
      return new _Canvas__WEBPACK_IMPORTED_MODULE_3__["default"]()
    } else if (tagName === 'audio') {
      return new _Audio__WEBPACK_IMPORTED_MODULE_4__["default"]()
    } else if (tagName === 'img') {
      return new _Image__WEBPACK_IMPORTED_MODULE_2__["default"]()
    }

    return new _HTMLElement__WEBPACK_IMPORTED_MODULE_1__["default"](tagName)
  },

  createElementNS(nameSpace, tagName) {
    return this.createElement(tagName);
  },

  getElementById(id) {
    if (id === _window__WEBPACK_IMPORTED_MODULE_0__.canvas.id) {
      return _window__WEBPACK_IMPORTED_MODULE_0__.canvas
    }
    return null
  },

  getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [_window__WEBPACK_IMPORTED_MODULE_0__.canvas]
    }
    return []
  },

  getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head]
    } else if (tagName === 'body') {
      return [document.body]
    } else if (tagName === 'canvas') {
      return [_window__WEBPACK_IMPORTED_MODULE_0__.canvas]
    }
    return []
  },

  querySelector(query) {
    if (query === 'head') {
      return document.head
    } else if (query === 'body') {
      return document.body
    } else if (query === 'canvas') {
      return _window__WEBPACK_IMPORTED_MODULE_0__.canvas
    } else if (query === `#${_window__WEBPACK_IMPORTED_MODULE_0__.canvas.id}`) {
      return _window__WEBPACK_IMPORTED_MODULE_0__.canvas
    }
    return null
  },

  querySelectorAll(query) {
    if (query === 'head') {
      return [document.head]
    } else if (query === 'body') {
      return [document.body]
    } else if (query === 'canvas') {
      return [_window__WEBPACK_IMPORTED_MODULE_0__.canvas]
    }
    return []
  },

  addEventListener(type, listener) {
    if (!events[type]) {
      events[type] = []
    }
    events[type].push(listener)
  },

  removeEventListener(type, listener) {
    const listeners = events[type]

    if (listeners && listeners.length > 0) {
      for (let i = listeners.length; i--; i > 0) {
        if (listeners[i] === listener) {
          listeners.splice(i, 1)
          break
        }
      }
    }
  },

  dispatchEvent(event) {
    const listeners = events[event.type]

    if (listeners) {
      for (let i = 0; i < listeners.length; i++) {
        listeners[i](event)
      }
    }
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (document);


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/index.js":
/*!*************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/index.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _document__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./document */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/document.js");
/* harmony import */ var _window__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./window */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/window.js");



function inject() {
  // 暴露全局的 canvas
  _window__WEBPACK_IMPORTED_MODULE_1__.canvas = $global.screencanvas;
  _window__WEBPACK_IMPORTED_MODULE_1__.document = _document__WEBPACK_IMPORTED_MODULE_0__["default"];

  _window__WEBPACK_IMPORTED_MODULE_1__.addEventListener = (type, listener) => {
    _window__WEBPACK_IMPORTED_MODULE_1__.document.addEventListener(type, listener)
  }
  _window__WEBPACK_IMPORTED_MODULE_1__.removeEventListener = (type, listener) => {
    _window__WEBPACK_IMPORTED_MODULE_1__.document.removeEventListener(type, listener)
  }
  _window__WEBPACK_IMPORTED_MODULE_1__.dispatchEvent = _window__WEBPACK_IMPORTED_MODULE_1__.document.dispatchEvent;

  // const { platform } = my.getSystemInfoSync()

  Object.assign($global, _window__WEBPACK_IMPORTED_MODULE_1__);
}

if (!__webpack_require__.g.__isAdapterInjected) {
  __webpack_require__.g.__isAdapterInjected = true
  inject()
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/localStorage.js":
/*!********************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/localStorage.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const localStorage = {
  get length() {
    const { keys } = my.getStorageInfoSync()

    return keys.length
  },

  key(n) {
    const { keys } = my.getStorageInfoSync()

    return keys[n]
  },

  getItem(key) {
    let ret =  my.getStorageSync({
      key,
    });
    return ret && ret.data;
  },

  setItem(key, data) {
    return my.setStorageSync({
      key,
      data,
    });
  },

  removeItem(key) {
    my.removeStorageSync(key)
  },

  clear() {
    my.clearStorageSync()
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (localStorage);


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/location.js":
/*!****************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/location.js ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var location = {
  href: 'game.js',
  reload() {
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (location);


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/navigator.js":
/*!*****************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/navigator.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/index.js */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/util/index.js");


// TODO 需要 my.getSystemInfo 获取更详细信息
const systemInfo = my.getSystemInfoSync()
console.log(systemInfo)

const system = systemInfo.system;
const platform = systemInfo.platform;
const language = systemInfo.language;
const version = systemInfo.version;

const android = system ? system.toLowerCase().indexOf('android') !== -1 : false;

const uaDesc = android ? `Android; CPU ${system}` : `iPhone; CPU iPhone OS ${system} like Mac OS X`;
const ua = `Mozilla/5.0 (${uaDesc}) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/${version} MiniGame NetType/WIFI Language/${language}`;

const navigator = {
  platform,
  language: language,
  appVersion: `5.0 (${uaDesc}) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1`,
  userAgent: ua,
  onLine: true, // TODO 用 my.getNetworkStateChange 和 my.onNetworkStateChange 来返回真实的状态

  // TODO 用 my.getLocation 来封装 geolocation
  geolocation: {
    getCurrentPosition: _util_index_js__WEBPACK_IMPORTED_MODULE_0__.noop,
    watchPosition: _util_index_js__WEBPACK_IMPORTED_MODULE_0__.noop,
    clearWatch: _util_index_js__WEBPACK_IMPORTED_MODULE_0__.noop
  }
}

if (my.onNetworkStatusChange) {
    my.onNetworkStatusChange(function(event){
        navigator.onLine = event.isConnected;
    });
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (navigator);


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/requestAnimationFrame.js":
/*!*****************************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/requestAnimationFrame.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
let screencanvas = $global.screencanvas;
let requestAnimationFrame = screencanvas.requestAnimationFrame.bind(screencanvas);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (requestAnimationFrame);

/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/util/index.js":
/*!******************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/util/index.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "noop": () => (/* binding */ noop)
/* harmony export */ });
function noop() {}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/window.js":
/*!**************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/window.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "cancelAnimationFrame": () => (/* reexport safe */ _cancelAnimationFrame__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "HTMLCanvasElement": () => (/* reexport safe */ _HTMLCanvasElement__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   "HTMLElement": () => (/* reexport safe */ _HTMLElement__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "HTMLImageElement": () => (/* reexport safe */ _HTMLImageElement__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "Image": () => (/* reexport safe */ _Image__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   "ImageBitmap": () => (/* reexport safe */ _ImageBitmap__WEBPACK_IMPORTED_MODULE_5__["default"]),
/* harmony export */   "localStorage": () => (/* reexport safe */ _localStorage__WEBPACK_IMPORTED_MODULE_6__["default"]),
/* harmony export */   "location": () => (/* reexport safe */ _location__WEBPACK_IMPORTED_MODULE_7__["default"]),
/* harmony export */   "navigator": () => (/* reexport safe */ _navigator__WEBPACK_IMPORTED_MODULE_8__["default"]),
/* harmony export */   "requestAnimationFrame": () => (/* reexport safe */ _requestAnimationFrame__WEBPACK_IMPORTED_MODULE_9__["default"]),
/* harmony export */   "WebGLRenderingContext": () => (/* reexport safe */ _WebGLRenderingContext__WEBPACK_IMPORTED_MODULE_10__["default"]),
/* harmony export */   "WebSocket": () => (/* reexport safe */ _WebSocket__WEBPACK_IMPORTED_MODULE_11__["default"]),
/* harmony export */   "devicePixelRatio": () => (/* reexport safe */ _WindowProperties__WEBPACK_IMPORTED_MODULE_12__.devicePixelRatio),
/* harmony export */   "innerHeight": () => (/* reexport safe */ _WindowProperties__WEBPACK_IMPORTED_MODULE_12__.innerHeight),
/* harmony export */   "innerWidth": () => (/* reexport safe */ _WindowProperties__WEBPACK_IMPORTED_MODULE_12__.innerWidth),
/* harmony export */   "ontouchend": () => (/* reexport safe */ _WindowProperties__WEBPACK_IMPORTED_MODULE_12__.ontouchend),
/* harmony export */   "ontouchmove": () => (/* reexport safe */ _WindowProperties__WEBPACK_IMPORTED_MODULE_12__.ontouchmove),
/* harmony export */   "ontouchstart": () => (/* reexport safe */ _WindowProperties__WEBPACK_IMPORTED_MODULE_12__.ontouchstart),
/* harmony export */   "performance": () => (/* reexport safe */ _WindowProperties__WEBPACK_IMPORTED_MODULE_12__.performance),
/* harmony export */   "screen": () => (/* reexport safe */ _WindowProperties__WEBPACK_IMPORTED_MODULE_12__.screen)
/* harmony export */ });
/* harmony import */ var _cancelAnimationFrame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./cancelAnimationFrame */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/cancelAnimationFrame.js");
/* harmony import */ var _HTMLCanvasElement__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HTMLCanvasElement */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLCanvasElement.js");
/* harmony import */ var _HTMLElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./HTMLElement */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLElement.js");
/* harmony import */ var _HTMLImageElement__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./HTMLImageElement */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/HTMLImageElement.js");
/* harmony import */ var _Image__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Image */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/Image.js");
/* harmony import */ var _ImageBitmap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ImageBitmap */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/ImageBitmap.js");
/* harmony import */ var _localStorage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./localStorage */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/localStorage.js");
/* harmony import */ var _location__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./location */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/location.js");
/* harmony import */ var _navigator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./navigator */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/navigator.js");
/* harmony import */ var _requestAnimationFrame__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./requestAnimationFrame */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/requestAnimationFrame.js");
/* harmony import */ var _WebGLRenderingContext__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./WebGLRenderingContext */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WebGLRenderingContext.js");
/* harmony import */ var _WebSocket__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./WebSocket */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WebSocket.js");
/* harmony import */ var _WindowProperties__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./WindowProperties */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/WindowProperties.js");
















/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/AssetManager.js":
/*!*******************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/AssetManager.js ***!
  \*******************************************************************************************/
/***/ (() => {

const parser = $global.cc.assetManager.parser;
const downloader = $global.cc.assetManager.downloader;

function doNothing (url, options, onComplete) {
    onComplete(null, url);
}

downloader.downloadDomAudio = doNothing;

downloader.register({
    // Audio
    '.mp3' : doNothing,
    '.ogg' : doNothing,
    '.wav' : doNothing,
    '.m4a' : doNothing,

    // Image
    '.png' : doNothing,
    '.jpg' : doNothing,
    '.bmp' : doNothing,
    '.jpeg' : doNothing,
    '.gif' : doNothing,
    '.ico' : doNothing,
    '.tiff' : doNothing,
    '.image' : doNothing,
    '.webp' : doNothing,
    '.pvr': doNothing,
    '.pkm': doNothing,
});

parser.register({
    // Audio
    '.mp3' : doNothing,
    '.ogg' : doNothing,
    '.wav' : doNothing,
    '.m4a' : doNothing,
});


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/Audio.js":
/*!************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/Audio.js ***!
  \************************************************************************************/
/***/ (() => {

const Audio = $global.cc._Audio;
const sys = $global.cc.sys;

const originalPlay = Audio.prototype.play;
const originalSetCurrentTime = Audio.prototype.setCurrentTime;
const originalStop = Audio.prototype.stop;

if (Audio) {
    Object.assign(Audio.prototype, {
        _currentTime: 0,
        _hasPlayed: false,

        _createElement () {
            let url = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = $global.__globalAdapter.createInnerAudioContext();
            }
            this._element.src = url;
        },

        play () {
            this._hasPlayed = true;
            originalPlay.call(this);
            if (sys.os === sys.OS_ANDROID && this._currentTime !== 0 && this._element) {
                this._element.seek(this._currentTime);
                this._currentTime = 0;  // clear currentTime cache
            }
        },

        stop () {
            // HACK: on Android, can't call stop before first playing
            if (sys.os === sys.OS_ANDROID) {
                if (!this._hasPlayed){
                    return;
                }
                originalStop.call(this);
            }
            // HACK: fix audio seeking on iOS end
            else {
                let self = this;
                this._src && this._src._ensureLoaded(function () {
                    // should not seek on iOS end
                    // self._element.seek(0);
                    self._element.stop();
                    self._unbindEnded();
                    self.emit('stop');
                    self._state = Audio.State.STOPPED;
                });
            }
        },

        setCurrentTime (num) {
            // HACK: on Android, cannot call seek before playing
            if (sys.os === sys.OS_ANDROID && this._element && this._element.paused) {
                this._currentTime = num;
            } else {
                originalSetCurrentTime.call(this, num);
            }
        },
    });
}


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/cache-manager.js":
/*!********************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/cache-manager.js ***!
  \********************************************************************************************/
/***/ (() => {

// NOTE: can't cache file on Taobao iOS end
$global.cc.assetManager.cacheManager.cacheEnabled = $global.cc.sys.os !== $global.cc.sys.OS_IOS;

/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/index.js":
/*!************************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/index.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

__webpack_require__(/*! ./Audio */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/Audio.js");
__webpack_require__(/*! ./AssetManager */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/AssetManager.js");
__webpack_require__(/*! ./cache-manager */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/cache-manager.js");

/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/fs-utils.js":
/*!********************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/fs-utils.js ***!
  \********************************************************************************/
/***/ ((module) => {

var window = $global;

/****************************************************************************
 Copyright (c) 2017-2019 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// TODO: verify the my API
var fs = my.getFileSystemManager ? my.getFileSystemManager() : null;
var outOfStorageRegExp = /the maximum size of the file storage/;  // not exactly right

var fsUtils = {

    fs,

    isOutOfStorage (errMsg) {
        return outOfStorageRegExp.test(errMsg);
    },

    getUserDataPath () {
        return my.env.USER_DATA_PATH;
    },
    
    checkFsValid () {
        if (!fs) {
            console.warn('Can not get the file system!');
            return false;
        }
        return true;
    },
    
    deleteFile (filePath, onComplete) {
        fs.unlink({
            filePath: filePath,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Delete file failed: path: ${filePath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },
    
    downloadFile (remoteUrl, filePath, header, onProgress, onComplete) {
        var options = {
            url: remoteUrl,
            success: function (res) {
                if (!filePath) {
                    onComplete && onComplete(null, res.apFilePath);
                }
                else {
                    fsUtils.copyFile(res.apFilePath, filePath, onComplete);
                }
            },
            fail: function (res) {
                console.warn(`Download file failed: path: ${remoteUrl} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage), null);
            }
        }
        if (header) options.header = header;
        var task = my.downloadFile(options);
        onProgress && task.onProgressUpdate(onProgress);
    },
    
    saveFile (srcPath, destPath, onComplete) {
        // Hack, seems like my.saveFile dose not work
        fsUtils.copyFile(srcPath, destPath, onComplete);
    },
    
    copyFile (srcPath, destPath, onComplete) {
        fs.copyFile({
            srcPath: srcPath,
            destPath: destPath,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Copy file failed: path: ${srcPath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },
    
    writeFile (path, data, encoding, onComplete) {
        fs.writeFile({
            filePath: path,
            encoding: encoding,
            data: data,
            success: function () {
                onComplete && onComplete(null);
            },
            fail: function (res) {
                console.warn(`Write file failed: path: ${path} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage));
            }
        });
    },
    
    writeFileSync (path, data, encoding) {
        try {
            fs.writeFileSync({
                filePath: path,
                data: data,
                encoding: encoding,
            });
            return null;
        }
        catch (e) {
            console.warn(`Write file failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },
    
    readFile (filePath, encoding, onComplete) {
        fs.readFile({
            filePath: filePath,
            encoding: encoding,
            success: function (res) {
                onComplete && onComplete(null, res.data);
            },
            fail: function (res) {
                console.warn(`Read file failed: path: ${filePath} message: ${res.errorMessage}`);
                onComplete && onComplete (new Error(res.errorMessage), null);
            }
        });
    },
    
    readDir (filePath, onComplete) {
        fs.readdir({
            dirPath: filePath,
            success: function (res) {
                onComplete && onComplete(null, res.files);
            },
            fail: function (res) {
                console.warn(`Read directory failed: path: ${filePath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error(res.errorMessage), null);
            }
        });
    },
    
    readText (filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', onComplete);
    },
    
    readArrayBuffer (filePath, onComplete) {
        fsUtils.readFile(filePath, '', onComplete);
    },
    
    readJson (filePath, onComplete) {
        fsUtils.readFile(filePath, 'utf8', function (err, text) {
            var out = null;
            if (!err) {
                try {
                    out = JSON.parse(text);
                }
                catch (e) {
                    console.warn(`Read json failed: path: ${filePath} message: ${e.message}`);
                    err = new Error(e.message);
                }
            }
            onComplete && onComplete(err, out);
        });
    },

    readJsonSync (path) {
        try {
            var res = fs.readFileSync({
                filePath: path,
                encoding: 'utf8',
            });
            return JSON.parse(res.data);
        }
        catch (e) {
            console.warn(`Read json failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },
    
    makeDirSync (path, recursive) {
        try {
            fs.mkdirSync({
                dirPath: path,
                recursive: recursive,
            });
            return null;
        }
        catch (e) {
            console.warn(`Make directory failed: path: ${path} message: ${e.message}`);
            return new Error(e.message);
        }
    },

    rmdirSync (dirPath, recursive) {
        try {
            fs.rmdirSync({ dirPath, recursive });
        }
        catch (e) {
            console.warn(`rm directory failed: path: ${dirPath} message: ${e.message}`);
            return new Error(e.message);
        }
    },
    
    exists (filePath, onComplete) {
        // fs.access is not supported.
        // fs.access({
        //     path: filePath,
        //     success: function () {
        //         onComplete && onComplete(true);
        //     },
        //     fail: function () {
        //         onComplete && onComplete(false);
        //     }
        // });
        fs.readFile({
            filePath: filePath,
            success () {
                onComplete && onComplete(true);
            },
            fail () {
                onComplete && onComplete (false);
            }
        });
    },

    loadSubpackage (name, onProgress, onComplete) {
        throw new Error('Not Implemented');
    },

    unzip (zipFilePath, targetPath, onComplete) {
        fs.unzip({
            zipFilePath,
            targetPath,
            success () {
                onComplete && onComplete(null);
            },
            fail (res) {
                console.warn(`unzip failed: path: ${zipFilePath} message: ${res.errorMessage}`);
                onComplete && onComplete(new Error('unzip failed: ' + res.errorMessage));
            },
        })
    },
};

window.fsUtils = module.exports = fsUtils;


/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/systemInfo.js":
/*!**********************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/systemInfo.js ***!
  \**********************************************************************************/
/***/ (() => {

var window = $global;

const adapter = window.__globalAdapter;
let adaptSysFunc = adapter.adaptSys;

Object.assign(adapter, {
    // Extend adaptSys interface
    adaptSys (sys) {
        adaptSysFunc.call(this, sys);
        sys.platform = sys.TAOBAO;
    },
});

/***/ }),

/***/ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/unify.js":
/*!*****************************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/wrapper/unify.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

var window = $global;

const utils = __webpack_require__(/*! ../../../common/utils */ "./templates/cocos2-adapter-modified/common/utils.js");

if (window.__globalAdapter) {
    let globalAdapter = window.__globalAdapter;
    // SystemInfo
    globalAdapter.isSubContext = false;  // sub context not supported
    globalAdapter.isDevTool = my.isIDE;
    utils.cloneMethod(globalAdapter, my, 'getSystemInfoSync');

    // Audio
    globalAdapter.createInnerAudioContext = function () {
        let audio = my.createInnerAudioContext();
        if (my.getSystemInfoSync().platform === 'iOS') {
            let currentTime = 0;
            let originalSeek = audio.seek;
            audio.seek = function (time) {
                // need to access audio.paused in the next tick
                setTimeout(() => {
                    if (audio.paused) {
                        currentTime = time;
                    } else {
                        originalSeek.call(audio, time);
                    }
                }, 50);
            };

            let originalPlay = audio.play;
            audio.play = function () {
                if (currentTime !== 0) {
                    audio.seek(currentTime);
                    currentTime = 0; // clear cached currentTime
                }
                originalPlay.call(audio);
            };
        }
        return audio;
    };

    // FrameRate
    // utils.cloneMethod(globalAdapter, my, 'setPreferredFramesPerSecond');

    // Keyboard
    globalAdapter.showKeyboard = () => console.warn('showKeyboard not supported.');
    globalAdapter.hideKeyboard = () => console.warn('hideKeyboard not supported.');
    globalAdapter.updateKeyboard = () => console.warn('updateKeyboard not supported.');
    globalAdapter.onKeyboardInput = () => console.warn('onKeyboardInput not supported.');
    globalAdapter.onKeyboardConfirm = () => console.warn('onKeyboardConfirm not supported.');
    globalAdapter.onKeyboardComplete = () => console.warn('onKeyboardComplete not supported.');
    globalAdapter.offKeyboardInput = () => console.warn('offKeyboardInput not supported.');
    globalAdapter.offKeyboardConfirm = () => console.warn('offKeyboardConfirm not supported.');
    globalAdapter.offKeyboardComplete = () => console.warn('offKeyboardComplete not supported.');

    // Message
    utils.cloneMethod(globalAdapter, my, 'getOpenDataContext');
    utils.cloneMethod(globalAdapter, my, 'onMessage');

    // Subpackage not supported
    // utils.cloneMethod(globalAdapter, my, 'loadSubpackage');

    // SharedCanvas
    utils.cloneMethod(globalAdapter, my, 'getSharedCanvas');

    // Font
    globalAdapter.loadFont = function (url) {
        // my.loadFont crash when url is not in user data path
        return "Arial";
    };

    // hide show Event
    utils.cloneMethod(globalAdapter, my, 'onShow');
    utils.cloneMethod(globalAdapter, my, 'onHide');

    // Accelerometer
    let accelerometerCallback = null;
    let systemInfo = my.getSystemInfoSync();
    let windowWidth = systemInfo.windowWidth;
    let windowHeight = systemInfo.windowHeight;
    let isLandscape = windowWidth > windowHeight;
    function accelerometerChangeCallback (res, cb) {
        let resClone = {};

        let x = res.x;
        let y = res.y;

        if (isLandscape) {
            let tmp = x;
            x = -y;
            y = tmp;
        }

        resClone.x = x;
        resClone.y = y;
        resClone.z = res.z;
        accelerometerCallback && accelerometerCallback(resClone);
    }
    Object.assign(globalAdapter, {
        startAccelerometer (cb) {
            accelerometerCallback = cb;
            my.onAccelerometerChange && my.onAccelerometerChange(accelerometerChangeCallback);
        },

        stopAccelerometer () {
            my.offAccelerometerChange && my.offAccelerometerChange(accelerometerChangeCallback);
        },
    });
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************************************************!*\
  !*** ./templates/cocos2-adapter-modified/platforms/taobao/index.js ***!
  \*********************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var window = $global;

const _global = window;
const adapter = _global.__globalAdapter = _global.__globalAdapter || {};

Object.assign(adapter, {
    init() {
        __webpack_require__(/*! ./wrapper/builtin */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/builtin/index.js");
        _global.DOMParser = __webpack_require__(/*! ../../common/xmldom/dom-parser */ "./templates/cocos2-adapter-modified/common/xmldom/dom-parser.js").DOMParser;
        __webpack_require__(/*! ./wrapper/unify */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/unify.js");
        __webpack_require__(/*! ./wrapper/fs-utils */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/fs-utils.js");
        __webpack_require__(/*! ../../common/engine/globalAdapter */ "./templates/cocos2-adapter-modified/common/engine/globalAdapter/index.js");
        __webpack_require__(/*! ./wrapper/systemInfo */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/systemInfo.js");
    },

    adaptEngine() {
        __webpack_require__(/*! ../../common/engine */ "./templates/cocos2-adapter-modified/common/engine/index.js");
        __webpack_require__(/*! ./wrapper/engine */ "./templates/cocos2-adapter-modified/platforms/taobao/wrapper/engine/index.js");
    },
});

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({});
})();

var __webpack_export_target__ = exports;
var __webpack_exports_export__ = __webpack_exports__["default"];
for(var i in __webpack_exports_export__) __webpack_export_target__[i] = __webpack_exports_export__[i];
if(__webpack_exports_export__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;