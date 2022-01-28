'use strict';
const assert = require('assert');
const stream = require('stream');
const writable = new stream.Writable();
function testStates(ending, finished, ended) {
  assert.strictEqual(writable._writableState.ending, ending);
  assert.strictEqual(writable._writableState.finished, finished);
  assert.strictEqual(writable._writableState.ended, ended);
}
writable._write = (chunk, encoding, cb) => {
  testStates(false, false, false);
  cb();
};
writable.on('finish', () => {
  testStates(true, true, true);
});
const result = writable.end('testing function end()', () => {
  testStates(true, true, true);
});
assert.strictEqual(result, writable);
testStates(true, false, true);
