var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;
var window = $global;
function handleTouchEvent(event) {
	let changedTouches = event.changedTouches;
	if (changedTouches) {
		for (let touch of changedTouches) {
			touch.clientX = touch.x;
			touch.clientY = touch.y;
		}
	}
}

Page({
	onReady() {
		console.log('onReady');
		// var offscreenCanvas = my.createOffscreenCanvas(100, 100);
		//   offscreenCanvas.width = 300;  
		//   offscreenCanvas.height = 300;  
		//   // 使用 2D 上下文  
		//   var context2D = offscreenCanvas.getContext("2d");  
	},
	canvasOnReady() {
		console.log('canvasOnReady');

		my.createCanvas({
			id: 'GameCanvas',
			success(canvas) {
				// 使用 WebGL 上下文  
				var contextWebGL = canvas.getContext("webgl");  // ... 
				$global.webglContext = contextWebGL;
				console.log(contextWebGL);
				$global.screencanvas = canvas;

				my.onTouchStart = function (cb) {
					touchstartCB = cb;
				}
				my.onTouchCancel = function (cb) {
					touchcancelCB = cb;
				}
				my.onTouchEnd = function (cb) {
					touchendCB = cb;
				}
				my.onTouchMove = function (cb) {
					touchmoveCB = cb;
				}
				require("../../game");
				//   require('../../adapter');

				window.__globalAdapter.onTouchStart = function (cb) {
					touchstartCB = cb;
				}
				window.__globalAdapter.onTouchCancel = function (cb) {
					touchcancelCB = cb;
				}
				window.__globalAdapter.onTouchEnd = function (cb) {
					touchendCB = cb;
				}
				window.__globalAdapter.onTouchMove = function (cb) {
					touchmoveCB = cb;
				}
			},
			fail(err) {
				console.error('failed to init on screen canvas', err)
			}
		});

	},
	onError(err) {
		console.error('error in page: ', err);
	},
	onTouchStart(event) {
		handleTouchEvent(event);
		touchstartCB && touchstartCB(event);
	},
	onTouchCancel(event) {
		handleTouchEvent(event);
		touchcancelCB && touchcancelCB(event);
	},
	onTouchEnd(event) {
		handleTouchEvent(event);
		touchendCB && touchendCB(event);
	},
	onTouchMove(event) {
		handleTouchEvent(event);
		touchmoveCB && touchmoveCB(event);
	},
});
