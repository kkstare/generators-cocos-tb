"use strict";

if (cc && cc.LabelComponent) {
  // const gfx = cc.gfx;
  var Label = cc.LabelComponent;
  var isDevTool = __globalAdapter.isDevTool; // shared label canvas

  var _sharedLabelCanvas = document.createElement('canvas');

  var _sharedLabelCanvasCtx = _sharedLabelCanvas.getContext('2d');

  var canvasData = {
    canvas: _sharedLabelCanvas,
    context: _sharedLabelCanvasCtx
  };
  cc.game.on(cc.Game.EVENT_ENGINE_INITED, function () {
    Object.assign(Label._canvasPool, {
      get: function get() {
        return canvasData;
      },
      put: function put() {// do nothing
      }
    });
  });
}