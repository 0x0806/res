'use strict';
const assert = require('assert');
const errorMsg = 'BAM!';
setTimeout(common.mustCall(function() {
  throw new Error(errorMsg);
}), 1);
setTimeout(common.mustCall(), 1);
function uncaughtException(err) {
  assert.strictEqual(err.message, errorMsg);
}
process.on('uncaughtException', common.mustCall(uncaughtException));
