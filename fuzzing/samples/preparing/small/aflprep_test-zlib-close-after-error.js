'use strict';
const assert = require('assert');
const zlib = require('zlib');
const decompress = zlib.createGunzip(15);
decompress.on('error', common.mustCall((err) => {
  assert.strictEqual(decompress._closed, true);
  decompress.close();
}));
assert.strictEqual(decompress._closed, false);
decompress.write('something invalid');
