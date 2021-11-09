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

  },
  onShow(options) {

    onShowCB && onShowCB();
  },
  onHide(options) {
    onHideCB && onHideCB();
  },
});
