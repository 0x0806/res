'use strict';
const timers = require('timers');
const assert = require('assert');
const someObject = {};
let nbTimeouts = 0;
const N = 5;
const TEST_DURATION = 1000;
timers.unenroll(someObject);
timers.enroll(someObject, 1);
someObject._onTimeout = function _onTimeout() {
  ++nbTimeouts;
  if (nbTimeouts === N) timers.unenroll(someObject);
  timers._unrefActive(someObject);
};
timers._unrefActive(someObject);
setTimeout(function() {
  assert.strictEqual(nbTimeouts, N);
}, TEST_DURATION);
