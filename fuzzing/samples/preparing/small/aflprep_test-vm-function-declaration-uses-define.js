'use strict';
const vm = require('vm');
const assert = require('assert');
const ctx = vm.createContext();
Object.defineProperty(ctx, 'x', {
  enumerable: true,
  configurable: true,
  get: common.mustNotCall('ctx.x getter must not be called'),
  set: common.mustNotCall('ctx.x setter must not be called'),
});
vm.runInContext('function x() {}', ctx);
assert.strictEqual(typeof ctx.x, 'function');
