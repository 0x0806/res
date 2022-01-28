'use strict';
const stream = require('stream');
process.on('uncaughtException', common.mustCall());
const r = new stream.Readable();
r._read = function(size) {
  r.push(Buffer.allocUnsafe(size));
};
const w = new stream.Writable();
w._write = function(data, encoding, cb) {
  cb(null);
};
r.pipe(w);
w.end();
