'use strict';
const assert = require('assert');
const buffer = require('buffer');
const oldkMaxLength = buffer.kMaxLength;
buffer.kMaxLength = 64;
const zlib = require('zlib');
buffer.kMaxLength = oldkMaxLength;
const encoded = Buffer.from('G38A+CXCIrFAIAM=', 'base64');
zlib.brotliDecompress(encoded, function(err) {
  assert.ok(err instanceof RangeError);
});
assert.throws(function() {
  zlib.brotliDecompressSync(encoded);
}, RangeError);
