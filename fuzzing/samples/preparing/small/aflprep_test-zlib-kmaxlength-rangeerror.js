'use strict';
const assert = require('assert');
const buffer = require('buffer');
const oldkMaxLength = buffer.kMaxLength;
buffer.kMaxLength = 64;
const zlib = require('zlib');
buffer.kMaxLength = oldkMaxLength;
zlib.gunzip(encoded, function(err) {
  assert.ok(err instanceof RangeError);
});
assert.throws(function() {
  zlib.gunzipSync(encoded);
}, RangeError);
