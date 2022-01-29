'use strict';
const assert = require('assert');
const tracker = new assert.CallTracker();
function foo() {}
const callsfoo = tracker.calls(foo, 1);
assert.strictEqual(tracker.report()[0].operator, 'foo');
callsfoo();
assert.strictEqual(typeof tracker.report()[0], 'undefined');
callsfoo();
assert.strictEqual(tracker.report()[0].operator, 'foo');
