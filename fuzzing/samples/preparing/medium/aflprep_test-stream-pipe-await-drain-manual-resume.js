'use strict';
const stream = require('stream');
const assert = require('assert');
const writable = new stream.Writable({
  highWaterMark: 5
});
let isCurrentlyBufferingWrites = true;
const queue = [];
writable._write = (chunk, encoding, cb) => {
  if (isCurrentlyBufferingWrites)
    queue.push({ chunk, cb });
  else
    cb();
};
const readable = new stream.Readable({
  read() {}
});
readable.pipe(writable);
readable.once('pause', common.mustCall(() => {
  assert.strictEqual(
    readable._readableState.awaitDrainWriters,
    writable,
    'Expected awaitDrainWriters to be a Writable but instead got ' +
    `${readable._readableState.awaitDrainWriters}`
  );
  process.nextTick(common.mustCall(() => {
    readable.resume();
  }));
  readable.once('pause', common.mustCall(() => {
    assert.strictEqual(
      readable._readableState.awaitDrainWriters,
      writable,
      '.resume() should not reset the awaitDrainWriters, but instead got ' +
      `${readable._readableState.awaitDrainWriters}`
    );
    isCurrentlyBufferingWrites = false;
    for (const queued of queue)
      queued.cb();
  }));
}));
readable.push(null);
writable.on('finish', common.mustCall(() => {
  assert.strictEqual(
    readable._readableState.awaitDrainWriters,
    null,
    `awaitDrainWriters should be reset to null
    after all chunks are written but instead got
    ${readable._readableState.awaitDrainWriters}`
  );
}));
