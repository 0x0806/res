'use strict';
const fs = require('fs');
if (!common.isOSX) {
  common.skip('this tests works only on MacOS');
}
const assert = require('assert');
fs.readdir(
  { withFileTypes: true, encoding: 'buffer' },
  common.mustCall((e, d) => {
    assert.strictEqual(e, null);
  })
);
