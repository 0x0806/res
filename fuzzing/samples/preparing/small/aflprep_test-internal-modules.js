'use strict';
const assert = require('assert');
assert.throws(function() {
assert.strictEqual(
  require(fixtures.path('internal-modules')),
  42
);
