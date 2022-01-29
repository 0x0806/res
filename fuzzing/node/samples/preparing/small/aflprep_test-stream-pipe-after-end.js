'use strict';
const assert = require('assert');
const { Readable, Writable } = require('stream');
class TestReadable extends Readable {
  constructor(opt) {
    super(opt);
    this._ended = false;
  }
  _read() {
    if (this._ended)
      this.emit('error', new Error('_read called twice'));
    this._ended = true;
    this.push(null);
  }
}
class TestWritable extends Writable {
  constructor(opt) {
    super(opt);
    this._written = [];
  }
  _write(chunk, encoding, cb) {
    this._written.push(chunk);
    cb();
  }
}
const ender = new TestReadable();
const piper = new TestReadable();
piper.read();
setTimeout(common.mustCall(function() {
  ender.on('end', common.mustCall());
  const c = ender.read();
  assert.strictEqual(c, null);
  const w = new TestWritable();
  w.on('finish', common.mustCall());
  piper.pipe(w);
}), 1);
