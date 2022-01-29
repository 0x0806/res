'use strict';
const stream = require('stream');
const r = new stream.Readable();
r._read = function(size) {
  r.push(Buffer.allocUnsafe(size));
};
const w = new stream.Writable();
w._write = function(data, encoding, cb) {
  process.nextTick(cb, null);
};
r.pipe(w);
process.nextTick(() => {
  w.end();
});
