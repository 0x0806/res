'use strict';
const assert = require('assert');
assert.throws(() => {
  process.dlopen({ exports: undefined }, someBindingPath);
}, Error);
