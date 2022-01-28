'use strict';
const assert = require('assert');
const path = require('path');
const fixturesRequire = require(
  fixtures.path('module-extension-over-directory', 'inner'));
assert.strictEqual(
  fixturesRequire,
  require(fixtures.path('module-extension-over-directory', 'inner.js')),
  'test-require-extension-over-directory failed to import fixture' +
  ' requirements'
);
const fakePath = [
  fixtures.path('module-extension-over-directory', 'inner'),
  'fake',
  '..',
].join(path.sep);
const fixturesRequireDir = require(fakePath);
assert.strictEqual(
  fixturesRequireDir,
  'test-require-extension-over-directory failed to import fixture' +
  ' requirements'
);
