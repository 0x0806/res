'use strict';
const assert = require('assert');
const zlib = require('zlib');
const file = fixtures.readSync('person.jpg');
const chunkSize = 16;
const deflater = new zlib.BrotliCompress();
const chunk = file.slice(0, chunkSize);
let actualFull;
deflater.write(chunk, function() {
  deflater.flush(function() {
    const bufs = [];
    let buf;
    while (buf = deflater.read())
      bufs.push(buf);
    actualFull = Buffer.concat(bufs);
  });
});
process.once('exit', function() {
  assert.deepStrictEqual(actualFull, expectedFull);
});
