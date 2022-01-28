'use strict';
const assert = require('assert');
const Stream = require('stream');
const Readable = Stream.Readable;
const r = new Readable();
const N = 256;
let reads = 0;
r._read = function(n) {
  return r.push(++reads === N ? null : Buffer.allocUnsafe(1));
};
r.on('end', common.mustCall());
const w = new Stream();
w.writable = true;
let buffered = 0;
w.write = function(c) {
  buffered += c.length;
  process.nextTick(drain);
  return false;
};
function drain() {
  assert(buffered <= 3);
  buffered = 0;
  w.emit('drain');
}
w.end = common.mustCall();
r.pipe(w);
