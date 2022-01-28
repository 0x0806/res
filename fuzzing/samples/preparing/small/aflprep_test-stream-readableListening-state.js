'use strict';
const assert = require('assert');
const stream = require('stream');
const r = new stream.Readable({
  read: () => {}
});
assert.strictEqual(r._readableState.readableListening, false);
r.on('readable', common.mustCall(() => {
  assert.strictEqual(r._readableState.readableListening, true);
}));
r.push(Buffer.from('Testing readableListening state'));
const r2 = new stream.Readable({
  read: () => {}
});
assert.strictEqual(r2._readableState.readableListening, false);
r2.on('data', common.mustCall((chunk) => {
  assert.strictEqual(r2._readableState.readableListening, false);
}));
r2.push(Buffer.from('Testing readableListening state'));
