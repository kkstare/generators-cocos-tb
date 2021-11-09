if ($global.cc && $global.cc.LabelComponent) {
    // const gfx = cc.gfx;
    const Label = $global.cc.LabelComponent;
    const isDevTool = $global.__globalAdapter.isDevTool;
    // shared label canvas
    let _sharedLabelCanvas = $global.document.createElement('canvas');
    let _sharedLabelCanvasCtx = _sharedLabelCanvas.getContext('2d');
    let canvasData = {
        canvas: _sharedLabelCanvas,
        context: _sharedLabelCanvasCtx,
    };

    $global.cc.game.on($global.cc.Game.EVENT_ENGINE_INITED, function () {
        Object.assign(Label._canvasPool, {
            get() {
                return canvasData;
            },

            put() {
                // do nothing
            }
        });
    });
}
