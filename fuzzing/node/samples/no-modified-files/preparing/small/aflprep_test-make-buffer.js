'use strict';
const assert = require('assert');
const {
  makeBufferInNewContext
assert.throws(
  () => makeBufferInNewContext(),
  (exception) => {
    assert.strictEqual(exception.constructor.name, 'Error');
    assert(!(exception.constructor instanceof Error));
    assert.strictEqual(exception.code, 'ERR_BUFFER_CONTEXT_NOT_AVAILABLE');
    assert.strictEqual(exception.message,
                       'Buffer is not available for the current Context');
    return true;
  }
);
