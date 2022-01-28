'use strict';
const assert = require('assert');
const { Writable } = require('stream');
for (const withPendingData of [ false, true ]) {
  for (const useEnd of [ false, true ]) {
    const callbacks = [];
    const w = new Writable({
      write(data, enc, cb) {
        callbacks.push(cb);
      },
      highWaterMark: 1
    });
    let chunksWritten = 0;
    let drains = 0;
    let finished = false;
    w.on('drain', () => drains++);
    w.on('finish', () => finished = true);
    function onWrite(err) {
      if (err) {
        assert.strictEqual(w.destroyed, true);
        assert.strictEqual(err.code, 'ERR_STREAM_DESTROYED');
      } else {
        chunksWritten++;
      }
    }
    w.write('abc', onWrite);
    assert.strictEqual(chunksWritten, 0);
    assert.strictEqual(drains, 0);
    callbacks.shift()();
    assert.strictEqual(chunksWritten, 1);
    assert.strictEqual(drains, 1);
    if (withPendingData) {
      w.write('def', onWrite);
    }
    if (useEnd) {
      w.end('ghi', onWrite);
    } else {
      w.write('ghi', onWrite);
    }
    assert.strictEqual(chunksWritten, 1);
    w.destroy();
    assert.strictEqual(chunksWritten, 1);
    callbacks.shift()();
    assert.strictEqual(chunksWritten, useEnd && !withPendingData ? 1 : 2);
    assert.strictEqual(callbacks.length, 0);
    assert.strictEqual(drains, 1);
    assert.strictEqual(finished, !withPendingData && useEnd);
  }
}
