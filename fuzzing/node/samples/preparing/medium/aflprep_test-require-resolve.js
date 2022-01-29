'use strict';
const assert = require('assert');
const { builtinModules } = require('module');
const path = require('path');
assert.strictEqual(
  require.resolve(fixtures.path('a')).toLowerCase(),
  fixtures.path('a.js').toLowerCase());
assert.strictEqual(
  require.resolve(fixtures.path('nested-index', 'one')).toLowerCase(),
  fixtures.path('nested-index', 'one', 'index.js').toLowerCase());
assert.strictEqual(require.resolve('path'), 'path');
require(fixtures.path('require-resolve.js'));
require(fixtures.path('resolve-paths', 'default', 'verify-paths.js'));
[1, false, null, undefined, {}].forEach((value) => {
  const message = 'The "request" argument must be of type string.' +
    common.invalidArgTypeHelper(value);
  assert.throws(
    () => { require.resolve(value); },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      message
    });
  assert.throws(
    () => { require.resolve.paths(value); },
    {
      code: 'ERR_INVALID_ARG_TYPE',
      message
    });
});
{
  builtinModules.forEach((mod) => {
    assert.strictEqual(require.resolve.paths(mod), null);
  });
  const resolvedPaths = require.resolve.paths('eslint');
  assert.strictEqual(Array.isArray(resolvedPaths), true);
  assert.strictEqual(resolvedPaths[0].includes('node_modules'), true);
  relativeModules.forEach((mod) => {
    const resolvedPaths = require.resolve.paths(mod);
    assert.strictEqual(Array.isArray(resolvedPaths), true);
    assert.strictEqual(resolvedPaths.length, 1);
    assert.strictEqual(resolvedPaths[0], path.dirname(__filename));
  });
}
