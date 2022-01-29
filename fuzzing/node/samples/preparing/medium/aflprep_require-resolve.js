'use strict';
const assert = require('assert');
const path = require('path');
const nodeModules = path.join(__dirname, 'node_modules');
const nestedNodeModules = path.join(__dirname, 'node_modules', 'node_modules');
const nestedIndex = path.join(__dirname, 'nested-index');
assert.strictEqual(
  require.resolve('bar'),
  path.join(nodeModules, 'bar.js')
);
assert.throws(() => {
  require.resolve('bar', { paths: [] })
{
  assert.throws(() => {
    require.resolve('three')
  assert.throws(() => {
    require.resolve('three', { paths: [nestedIndex] })
  assert.strictEqual(
    require.resolve('bar', { paths: [nestedIndex] }),
    path.join(nodeModules, 'bar.js')
  );
}
{
  const paths = require.resolve.paths('bar');
  assert.strictEqual(paths[0], nodeModules);
  assert.strictEqual(
    require.resolve('bar', { paths }),
    path.join(nodeModules, 'bar.js')
  );
  paths.unshift(nestedNodeModules);
  assert.strictEqual(
    require.resolve('bar', { paths }),
    path.join(nodeModules, 'bar.js')
  );
}
{
  assert.strictEqual(
    path.join(nestedIndex, 'three.js')
  );
  assert.strictEqual(
    path.join(nestedIndex, 'three.js')
  );
  if (common.isWindows) {
    assert.strictEqual(
      require.resolve('.\\three.js', { paths: [searchIn] }),
      path.join(nestedIndex, 'three.js')
    );
    assert.strictEqual(
      require.resolve('.\\three.js', { paths: [nestedIndex] }),
      path.join(nestedIndex, 'three.js')
    );
  }
}
assert.throws(() => {
  require.resolve('.\\three.js', { paths: 'foo' })
}, {
  code: 'ERR_INVALID_ARG_VALUE',
  name: 'TypeError',
});
assert.strictEqual(
);
