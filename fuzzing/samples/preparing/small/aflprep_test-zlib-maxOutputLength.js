'use strict';
const assert = require('assert');
const zlib = require('zlib');
const encoded = Buffer.from('G38A+CXCIrFAIAM=', 'base64');
zlib.brotliDecompress(encoded, { maxOutputLength: 64 }, common.expectsError({
  code: 'ERR_BUFFER_TOO_LARGE',
  message: 'Cannot create a Buffer larger than 64 bytes'
}));
assert.throws(function() {
  zlib.brotliDecompressSync(encoded, { maxOutputLength: 64 });
}, RangeError);
zlib.brotliDecompress(encoded, { maxOutputLength: 256 }, function(err) {
  assert.strictEqual(err, null);
});
zlib.brotliDecompressSync(encoded, { maxOutputLength: 256 });
