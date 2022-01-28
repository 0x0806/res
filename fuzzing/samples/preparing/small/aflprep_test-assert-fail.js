'use strict';
const assert = require('assert');
assert.throws(
  () => { assert.fail(); },
  {
    code: 'ERR_ASSERTION',
    name: 'AssertionError',
    message: 'Failed',
    operator: 'fail',
    actual: undefined,
    expected: undefined,
    generatedMessage: true,
  }
);
assert.throws(() => {
  assert.fail('custom message');
}, {
  code: 'ERR_ASSERTION',
  name: 'AssertionError',
  message: 'custom message',
  operator: 'fail',
  actual: undefined,
  expected: undefined,
  generatedMessage: false
});
assert.throws(() => {
  assert.fail(new TypeError('custom message'));
}, {
  name: 'TypeError',
  message: 'custom message'
});
