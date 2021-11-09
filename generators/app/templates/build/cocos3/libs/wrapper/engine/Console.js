"use strict";

// Alipay console.time have some error ,hack here
var Timer = window.performance;

var _timerTable = Object.create(null);

console.time = function (label) {
  _timerTable[label] = Timer.now();
};

console.timeEnd = function (label) {
  var startTime = _timerTable[label];
  var duration = Timer.now() - startTime;
  console.log("".concat(label, ": ").concat(duration, "ms"));
};