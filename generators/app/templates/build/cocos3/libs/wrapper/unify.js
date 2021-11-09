"use strict";

var utils = require('./utils');

if (window.__globalAdapter) {
  var accelerometerChangeCallback = function accelerometerChangeCallback(res, cb) {
    var resClone = {};
    var x = res.x;
    var y = res.y;

    if (isLandscape) {
      var tmp = x;
      x = -y;
      y = tmp;
    }

    resClone.x = x;
    resClone.y = y;
    resClone.z = res.z;
    accelerometerCallback && accelerometerCallback(resClone);
  };

  var globalAdapter = window.__globalAdapter; // SystemInfo

  globalAdapter.isSubContext = false; // sub context not supported

  globalAdapter.isDevTool = window.navigator && /AlipayIDE/.test(window.navigator.userAgent);
  utils.cloneMethod(globalAdapter, my, 'getSystemInfoSync'); // TouchEvent
  // my.onTouchStart register touch event listner on body
  // need to register on canvas

  globalAdapter.onTouchStart = function (cb) {
    window.canvas.addEventListener('touchstart', function (res) {
      cb && cb(res);
    });
  };

  globalAdapter.onTouchMove = function (cb) {
    window.canvas.addEventListener('touchmove', function (res) {
      cb && cb(res);
    });
  };

  globalAdapter.onTouchEnd = function (cb) {
    window.canvas.addEventListener('touchend', function (res) {
      cb && cb(res);
    });
  };

  globalAdapter.onTouchCancel = function (cb) {
    window.canvas.addEventListener('touchcancel', function (res) {
      cb && cb(res);
    });
  }; // Audio


  globalAdapter.createInnerAudioContext = function () {
    var audio = my.createInnerAudioContext();
    audio.onCanplay = audio.onCanPlay.bind(audio);
    audio.offCanplay = audio.offCanPlay.bind(audio);
    return audio;
  }; // FrameRate


  utils.cloneMethod(globalAdapter, my, 'setPreferredFramesPerSecond'); // Keyboard

  utils.cloneMethod(globalAdapter, my, 'showKeyboard');
  utils.cloneMethod(globalAdapter, my, 'hideKeyboard');
  utils.cloneMethod(globalAdapter, my, 'updateKeyboard');
  utils.cloneMethod(globalAdapter, my, 'onKeyboardInput');
  utils.cloneMethod(globalAdapter, my, 'onKeyboardConfirm');
  utils.cloneMethod(globalAdapter, my, 'onKeyboardComplete');
  utils.cloneMethod(globalAdapter, my, 'offKeyboardInput');
  utils.cloneMethod(globalAdapter, my, 'offKeyboardConfirm');
  utils.cloneMethod(globalAdapter, my, 'offKeyboardComplete'); // Message

  utils.cloneMethod(globalAdapter, my, 'getOpenDataContext');
  utils.cloneMethod(globalAdapter, my, 'onMessage'); // Subpackage not supported
  // utils.cloneMethod(globalAdapter, my, 'loadSubpackage');
  // SharedCanvas

  utils.cloneMethod(globalAdapter, my, 'getSharedCanvas'); // Font

  globalAdapter.loadFont = function (url) {
    // my.loadFont crash when url is not in user data path
    return "Arial";
  }; // hide show Event


  utils.cloneMethod(globalAdapter, my, 'onShow');
  utils.cloneMethod(globalAdapter, my, 'onHide'); // Accelerometer

  var accelerometerCallback = null;
  var systemInfo = my.getSystemInfoSync();
  var windowWidth = systemInfo.windowWidth;
  var windowHeight = systemInfo.windowHeight;
  var isLandscape = windowWidth > windowHeight;
  Object.assign(globalAdapter, {
    startAccelerometer: function startAccelerometer(cb) {
      accelerometerCallback = cb;
      my.onAccelerometerChange && my.onAccelerometerChange(accelerometerChangeCallback);
    },
    stopAccelerometer: function stopAccelerometer() {
      my.offAccelerometerChange && my.offAccelerometerChange(accelerometerChangeCallback);
    }
  });
}