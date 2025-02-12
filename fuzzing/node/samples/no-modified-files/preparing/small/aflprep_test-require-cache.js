'use strict';
const assert = require('assert');
{
  const absolutePath = require.resolve(relativePath);
  const fakeModule = {};
  require.cache[absolutePath] = { exports: fakeModule };
  assert.strictEqual(require(relativePath), fakeModule);
}
{
  const relativePath = 'fs';
  const fakeModule = {};
  require.cache[relativePath] = { exports: fakeModule };
  assert.strictEqual(require(relativePath), fakeModule);
}
