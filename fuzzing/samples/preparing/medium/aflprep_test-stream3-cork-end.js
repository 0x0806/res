'use strict';
const assert = require('assert');
const stream = require('stream');
const Writable = stream.Writable;
const expectedChunks = ['please', 'buffer', 'me', 'kindly'];
const inputChunks = expectedChunks.slice(0);
let seenChunks = [];
let seenEnd = false;
const w = new Writable();
w._write = function(chunk, encoding, cb) {
  assert.ok(!seenEnd);
  assert.strictEqual(encoding, 'buffer');
  seenChunks.push(chunk);
  cb();
};
w.on('finish', () => {
  seenEnd = true;
});
function writeChunks(remainingChunks, callback) {
  const writeChunk = remainingChunks.shift();
  let writeState;
  if (writeChunk) {
    setImmediate(() => {
      writeState = w.write(writeChunk);
      assert.ok(writeState);
      writeChunks(remainingChunks, callback);
    });
  } else {
    callback();
  }
}
w.write('stuff');
assert.strictEqual(seenChunks.length, 1);
seenChunks = [];
w.cork();
writeChunks(inputChunks, () => {
  assert.strictEqual(seenChunks.length, 0);
  w.end();
  assert.ok(!seenEnd);
  assert.strictEqual(seenChunks.length, 4);
  for (let i = 0, l = expectedChunks.length; i < l; i++) {
    const seen = seenChunks[i];
    assert.ok(seen);
    const expected = Buffer.from(expectedChunks[i]);
    assert.ok(seen.equals(expected));
  }
  setImmediate(() => {
    assert.ok(seenEnd);
  });
});
