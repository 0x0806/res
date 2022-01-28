'use strict';
const stream = require('stream');
const assert = require('assert');
const reader = new stream.Readable();
const writer1 = new stream.Writable();
const writer2 = new stream.Writable();
const writer3 = new stream.Writable();
const buffer = Buffer.allocUnsafe(560000);
reader._read = () => {};
writer1._write = common.mustCall(function(chunk, encoding, cb) {
  this.emit('chunk-received');
  process.nextTick(cb);
}, 1);
writer1.once('chunk-received', () => {
  assert.strictEqual(
    reader._readableState.awaitDrainWriters.size,
    0,
    'awaitDrain initial value should be 0, actual is ' +
    reader._readableState.awaitDrainWriters.size
  );
  setImmediate(() => {
    reader.push(buffer);
  });
});
writer2._write = common.mustCall((chunk, encoding, cb) => {
  assert.strictEqual(
    reader._readableState.awaitDrainWriters.size,
    1,
    'awaitDrain should be 1 after first push, actual is ' +
    reader._readableState.awaitDrainWriters.size
  );
}, 1);
writer3._write = common.mustCall((chunk, encoding, cb) => {
  assert.strictEqual(
    reader._readableState.awaitDrainWriters.size,
    2,
    'awaitDrain should be 2 after second push, actual is ' +
    reader._readableState.awaitDrainWriters.size
  );
}, 1);
reader.pipe(writer1);
reader.pipe(writer2);
reader.pipe(writer3);
reader.push(buffer);
