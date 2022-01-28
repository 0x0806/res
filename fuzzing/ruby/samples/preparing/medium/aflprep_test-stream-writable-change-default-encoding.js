'use strict';
const assert = require('assert');
const stream = require('stream');
class MyWritable extends stream.Writable {
  constructor(fn, options) {
    super(options);
    this.fn = fn;
  }
  _write(chunk, encoding, callback) {
    this.fn(Buffer.isBuffer(chunk), typeof chunk, encoding);
    callback();
  }
}
(function defaultCondingIsUtf8() {
  const m = new MyWritable(function(isBuffer, type, enc) {
    assert.strictEqual(enc, 'utf8');
  }, { decodeStrings: false });
  m.write('foo');
  m.end();
}());
(function changeDefaultEncodingToAscii() {
  const m = new MyWritable(function(isBuffer, type, enc) {
    assert.strictEqual(enc, 'ascii');
  }, { decodeStrings: false });
  m.setDefaultEncoding('ascii');
  m.write('bar');
  m.end();
}());
assert.throws(() => {
  const m = new MyWritable(
    (isBuffer, type, enc) => {},
    { decodeStrings: false });
  m.setDefaultEncoding({});
  m.write('bar');
  m.end();
}, {
  name: 'TypeError',
  code: 'ERR_UNKNOWN_ENCODING',
  message: 'Unknown encoding: {}'
});
(function checkVairableCaseEncoding() {
  const m = new MyWritable(function(isBuffer, type, enc) {
    assert.strictEqual(enc, 'ascii');
  }, { decodeStrings: false });
  m.setDefaultEncoding('AsCii');
  m.write('bar');
  m.end();
}());
