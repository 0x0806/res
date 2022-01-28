'use strict';
const assert = require('assert');
const util = require('util');
{
  const buf = Buffer.from('fhqwhgads');
  assert.strictEqual(util.inspect(buf), '<Buffer 66 68 71 77 68 67 61 64 73>');
}
{
  const buf = Buffer.from('');
  assert.strictEqual(util.inspect(buf), '<Buffer >');
}
{
  const buf = Buffer.from('x'.repeat(51));
}
