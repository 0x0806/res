'use strict';
const assert = require('assert');
const {
  defaultResolve: resolve
assert.throws(
  () => resolve('target'),
  {
    code: 'ERR_MODULE_NOT_FOUND',
    name: 'Error',
  }
);
