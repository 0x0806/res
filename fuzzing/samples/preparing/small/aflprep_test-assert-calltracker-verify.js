'use strict';
const assert = require('assert');
const tracker = new assert.CallTracker();
const msg = 'Function(s) were not called the expected number of times';
function foo() {}
const callsfoo = tracker.calls(foo, 1);
assert.throws(
  () => tracker.verify(),
  { message: msg }
);
callsfoo();
tracker.verify();
callsfoo();
assert.throws(
  () => tracker.verify(),
  { message: msg }
);
