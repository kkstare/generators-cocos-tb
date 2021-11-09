var touchstartCB;
var touchcancelCB;
var touchendCB;
var touchmoveCB;

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
	canvasOnReady() {
		my.createCanvas({
			id: 'GameCanvas',
			success(canvas) {
				$global.screencanvas = canvas;
				$global.__cocosCallback({
					afterAdapterInit: () => {
						$global.__globalAdapter.onTouchStart = function (cb) {
							touchstartCB = cb;
						}
						$global.__globalAdapter.onTouchCancel = function (cb) {
							touchcancelCB = cb;
						}
						$global.__globalAdapter.onTouchEnd = function (cb) {
							touchendCB = cb;
						}
						$global.__globalAdapter.onTouchMove = function (cb) {
							touchmoveCB = cb;
						}
					}
				});
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
