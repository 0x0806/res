'use strict';
const assert = require('assert');
const stream = require('stream');
let passed = false;
class TestStream extends stream.Transform {
  _transform(chunk, encoding, done) {
    if (!passed) {
      passed = chunk.toString().includes('a');
    }
    done();
  }
}
const s1 = new stream.Transform({
  transform(chunk, encoding, cb) {
    process.nextTick(cb, null, chunk);
  }
});
const s2 = new stream.PassThrough();
const s3 = new TestStream();
s1.pipe(s3);
s2.pipe(s3, { end: false });
const big = Buffer.alloc(s1.writableHighWaterMark + 1, 'x');
assert(!s1.write(big));
assert(s2.write('tiny'));
setImmediate(s1.write.bind(s1), 'later');
process.on('exit', function() {
  assert(passed, 'Large buffer is not handled properly by Writable Stream');
});
