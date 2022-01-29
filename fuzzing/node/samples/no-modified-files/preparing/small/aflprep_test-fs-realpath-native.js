'use strict';
const assert = require('assert');
const fs = require('fs');
const filename = __filename.toLowerCase();
assert.strictEqual(
    .toLowerCase(),
  filename);
fs.realpath.native(
  common.mustSucceed(function(res) {
    assert.strictEqual(res.toLowerCase(), filename);
    assert.strictEqual(this, undefined);
  }));
