var onShowCB;
var onHideCB;

App({
  onLaunch(options) {
    console.info('App onLaunched');
    // 小程序执行出错时
    my.onError(function (error) {
      console.error(['ERROR'], error);
    });
    my.onUnhandledRejection((res) => {
      console.error('[UnhandledRejection]', res.reason, res.promise);
    });
    my.onShow = function (cb) {
      onShowCB = cb;
    };
    my.onHide = function (cb) {
      onHideCB = cb;
    };

    $global.__cocosCallback = function (options) {
      require('./ccRequire');
      require('adapter-js-path');
      __globalAdapter.init();

      options.afterAdapterInit();

      __globalAdapter.onShow = function (cb) {
        onShowCB = cb;
      };
      __globalAdapter.onHide = function (cb) {
        onHideCB = cb;
      };

      require('cocos2d-js-path');
      require('physics-js-path');
      __globalAdapter.adaptEngine();

      require('./src/settings');
      // Introduce Cocos Service here
      require('./main');  // TODO: move to common

      // Adjust devicePixelRatio
      cc.view._maxPixelRatio = 4;

      // Release Image objects after uploaded gl texture
      cc.macro.CLEANUP_IMAGE_CACHE = true;

      window.boot();
    };
  },
  onShow(options) {

    onShowCB && onShowCB();
  },
  onHide(options) {
    onHideCB && onHideCB();
  },
});
