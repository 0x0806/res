'use strict';
const assert = require('assert');
{
  process.env.FOO = '';
  const foo = process.env.FOO;
  assert.strictEqual(foo, '');
}
{
  process.env.FOO = '';
  const hasFoo = 'FOO' in process.env;
  assert.strictEqual(hasFoo, true);
}
