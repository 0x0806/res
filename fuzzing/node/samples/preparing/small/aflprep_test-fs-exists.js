'use strict';
const assert = require('assert');
const fs = require('fs');
const f = __filename;
assert.throws(() => fs.exists(f), { code: 'ERR_INVALID_CALLBACK' });
assert.throws(() => fs.exists(), { code: 'ERR_INVALID_CALLBACK' });
assert.throws(() => fs.exists(f, {}), { code: 'ERR_INVALID_CALLBACK' });
fs.exists(f, common.mustCall(function(y) {
  assert.strictEqual(y, true);
}));
fs.exists(`${f}-NO`, common.mustCall(function(y) {
  assert.strictEqual(y, false);
}));
  assert.strictEqual(y, false);
}));
fs.exists({}, common.mustCall(function(y) {
  assert.strictEqual(y, false);
}));
assert(fs.existsSync(f));
assert(!fs.existsSync(`${f}-NO`));
assert(!fs.existsSync());
assert(!fs.existsSync({}));
