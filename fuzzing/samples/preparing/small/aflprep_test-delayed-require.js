'use strict';
const assert = require('assert');
setTimeout(common.mustCall(function() {
  const a = require(fixtures.path('a'));
  assert.strictEqual('A' in a, true);
  assert.strictEqual(a.A(), 'A');
  assert.strictEqual(a.D(), 'D');
}), 50);
