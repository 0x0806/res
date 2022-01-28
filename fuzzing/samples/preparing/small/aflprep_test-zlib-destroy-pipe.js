'use strict';
const zlib = require('zlib');
const { Writable } = require('stream');
const ts = zlib.createGzip();
const ws = new Writable({
  write: common.mustCall((chunk, enc, cb) => {
    setImmediate(cb);
    ts.destroy();
  })
});
const buf = Buffer.allocUnsafe(1024 * 1024 * 20);
ts.end(buf);
ts.pipe(ws);
