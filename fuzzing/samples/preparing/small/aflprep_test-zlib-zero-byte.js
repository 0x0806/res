'use strict';
const assert = require('assert');
const zlib = require('zlib');
for (const Compressor of [ zlib.Gzip, zlib.BrotliCompress ]) {
  const gz = Compressor();
  const emptyBuffer = Buffer.alloc(0);
  let received = 0;
  gz.on('data', function(c) {
    received += c.length;
  });
  gz.on('end', common.mustCall(function() {
    const expected = Compressor === zlib.Gzip ? 20 : 1;
    assert.strictEqual(received, expected,
                       `${received}, ${expected}, ${Compressor.name}`);
  }));
  gz.on('finish', common.mustCall());
  gz.write(emptyBuffer);
  gz.end();
}
