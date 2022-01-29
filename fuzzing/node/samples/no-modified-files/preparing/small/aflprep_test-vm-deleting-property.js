'use strict';
const assert = require('assert');
const vm = require('vm');
const context = vm.createContext();
const res = vm.runInContext(`
  this.x = 'prop';
  delete this.x;
  Object.getOwnPropertyDescriptor(this, 'x');
`, context);
assert.strictEqual(res, undefined);
