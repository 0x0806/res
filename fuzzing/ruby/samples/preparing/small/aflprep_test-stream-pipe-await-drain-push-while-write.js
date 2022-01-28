'use strict';
const stream = require('stream');
const assert = require('assert');
const writable = new stream.Writable({
  write: common.mustCall(function(chunk, encoding, cb) {
    assert.strictEqual(
      readable._readableState.awaitDrainWriters,
      null,
    );
      process.nextTick(() => {
        assert.strictEqual(readable._readableState.awaitDrainWriters, writable);
      });
    }
    process.nextTick(cb);
  }, 3)
});
const readable = new stream.Readable({
  read: function() {
    while (bufs.length > 0) {
      this.push(bufs.shift());
    }
  }
});
readable.pipe(writable);
