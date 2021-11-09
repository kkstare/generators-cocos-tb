var window = $global;

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
      require('./adapter');
      $global.__globalAdapter.init();

      options.afterAdapterInit();

      $global.__globalAdapter.onShow = function (cb) {
        onShowCB = cb;
      };
      $global.__globalAdapter.onHide = function (cb) {
        onHideCB = cb;
      };

      require('./cocos2d-js-min');
      require('./physics-min.js');
      $global.__globalAdapter.adaptEngine();

      require('./src/settings');
      // Introduce Cocos Service here
      require('./main');  // TODO: move to common

      // Adjust devicePixelRatio
      $global.cc.view._maxPixelRatio = 4;

      // Release Image objects after uploaded gl texture
      $global.cc.macro.CLEANUP_IMAGE_CACHE = true;

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
