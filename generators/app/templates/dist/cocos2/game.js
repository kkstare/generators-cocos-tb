var window = $global;

"use strict";

require('adapter-min.js');

$global.__globalAdapter.init();

require('cocos2d-js-min.js');

require('physics-min.js');

$global.__globalAdapter.adaptEngine();

require('./ccRequire');

require('./src/settings'); // Introduce Cocos Service here


require('./main'); // TODO: move to common
// Adjust devicePixelRatio


$global.cc.view._maxPixelRatio = 4; // Release Image objects after uploaded gl texture

$global.cc.macro.CLEANUP_IMAGE_CACHE = true;
window.boot();