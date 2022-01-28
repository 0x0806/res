'use strict';
const Stream = require('stream');
const assert = require('assert');
class StreamWritable extends Stream.Writable {
  constructor() {
    super({ objectMode: true });
  }
  _write(chunk, encoding, cb) {
    setImmediate(cb);
  }
}
const testStream = new StreamWritable();
testStream.cork();
for (let i = 1; i <= 5; i++) {
  testStream.write(i, common.mustCall(() => {
    assert.strictEqual(
      testStream._writableState.bufferedRequestCount,
      testStream._writableState.getBuffer().length
    );
  }));
}
testStream.end();
