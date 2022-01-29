'use strict';
const assert = require('assert');
const path = require('path');
const where = fixtures.path('require-empty-main');
const expected = path.join(where, 'index.js');
test();
setImmediate(test);
function test() {
  assert.strictEqual(require.resolve(where), expected);
  assert.strictEqual(require(where), 42);
  assert.strictEqual(require.resolve(where), expected);
}
