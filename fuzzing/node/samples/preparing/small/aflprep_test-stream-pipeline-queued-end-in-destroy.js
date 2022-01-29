'use strict';
const assert = require('assert');
const { Readable, Duplex, pipeline } = require('stream');
const readable = new Readable({
  read: common.mustCall(() => {})
});
const duplex = new Duplex({
  write(chunk, enc, cb) {
  },
  read() {},
  destroy(err, cb) {
    this.end();
    cb(err);
  }
});
duplex.on('finished', common.mustNotCall());
pipeline(readable, duplex, common.mustCall((err) => {
  assert.strictEqual(err.code, 'ERR_STREAM_PREMATURE_CLOSE');
}));
readable.push('foo');
setImmediate(() => {
  readable.destroy();
});
