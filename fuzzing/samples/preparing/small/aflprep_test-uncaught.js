'use strict';
const assert = require('assert');
process.on('uncaughtException', common.mustCall(function(err) {
  try {
    throw new Error('should not fail');
  } catch (err) {
    assert.strictEqual(err.message, 'should not fail');
  }
  assert.strictEqual(err.message, 'uncaught');
}));
test_async.Test(5, {}, common.mustCall(function() {
  throw new Error('uncaught');
}));
