'use strict';
const Readable = require('stream').Readable;
const r = new Readable();
const N = 256 * 1024;
let reads = 0;
r._read = function(n) {
  const chunk = reads++ === N ? null : Buffer.allocUnsafe(1);
  r.push(chunk);
};
r.on('readable', function onReadable() {
  if (!(r.readableLength % 256))
    console.error('readable', r.readableLength);
  r.read(N * 2);
});
r.on('end', common.mustCall());
r.read(0);
