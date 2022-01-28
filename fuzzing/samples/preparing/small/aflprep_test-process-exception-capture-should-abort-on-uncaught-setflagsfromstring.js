'use strict';
const assert = require('assert');
const v8 = require('v8');
assert.strictEqual(process.hasUncaughtExceptionCaptureCallback(), false);
v8.setFlagsFromString('--abort-on-uncaught-exception');
process.setUncaughtExceptionCaptureCallback(common.mustCall((err) => {
  assert.strictEqual(err.message, 'foo');
}));
throw new Error('foo');
