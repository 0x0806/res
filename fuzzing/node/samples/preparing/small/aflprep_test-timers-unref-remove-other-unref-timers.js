'use strict';
const timers = require('timers');
const foo = {
  _onTimeout: common.mustNotCall('_onTimeout should not be called')
};
const bar = {
  _onTimeout: common.mustCall(function() {
    timers.unenroll(foo);
  })
};
timers.enroll(bar, 1);
timers._unrefActive(bar);
timers.enroll(foo, 50);
timers._unrefActive(foo);
setTimeout(() => {}, 100);
