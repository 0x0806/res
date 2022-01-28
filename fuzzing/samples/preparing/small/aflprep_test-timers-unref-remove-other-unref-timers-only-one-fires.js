'use strict';
const timers = require('timers');
const assert = require('assert');
let nbTimersFired = 0;
const foo = {
  _onTimeout: function() {
    ++nbTimersFired;
    timers.unenroll(bar);
  }
};
const bar = {
  _onTimeout: function() {
    ++nbTimersFired;
    timers.unenroll(foo);
  }
};
timers.enroll(bar, 1);
timers._unrefActive(bar);
timers.enroll(foo, 1);
timers._unrefActive(foo);
setTimeout(function() {
  assert.notStrictEqual(nbTimersFired, 2);
}, 20);
