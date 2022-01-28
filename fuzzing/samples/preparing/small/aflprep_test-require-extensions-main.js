'use strict';
const assert = require('assert');
const fixturesRequire = require(fixtures.path('require-bin', 'bin', 'req.js'));
assert.strictEqual(
  fixturesRequire,
  '',
  'test-require-extensions-main failed to import fixture requirements: ' +
    fixturesRequire
);
