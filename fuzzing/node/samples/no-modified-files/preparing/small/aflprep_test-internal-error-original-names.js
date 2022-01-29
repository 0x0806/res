'use strict';
const assert = require('assert');
errors.E('TEST_ERROR_1', 'Error for testing purposes: %s',
         Error);
{
  const err = new errors.codes.TEST_ERROR_1('test');
  assert(err instanceof Error);
  assert.strictEqual(err.name, 'Error');
}
{
  errors.useOriginalName = true;
  const err = new errors.codes.TEST_ERROR_1('test');
  assert(err instanceof Error);
  assert.strictEqual(err.name, 'Error');
}
{
  errors.useOriginalName = false;
  const err = new errors.codes.TEST_ERROR_1('test');
  assert(err instanceof Error);
  assert.strictEqual(err.name, 'Error');
}
