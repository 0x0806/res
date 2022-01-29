'use strict';
const assert = require('assert');
const vm = require('vm');
const sandbox = { x: 3 };
const ctx = vm.createContext(sandbox);
assert.strictEqual(vm.runInContext('x;', ctx), 3);
vm.runInContext('y = 4;', ctx);
assert.strictEqual(sandbox.y, 4);
assert.strictEqual(ctx.y, 4);
const x = { get 1() { return 5; } };
const pd_expected = Object.getOwnPropertyDescriptor(x, 1);
const ctx2 = vm.createContext(x);
const pd_actual = Object.getOwnPropertyDescriptor(ctx2, 1);
assert.deepStrictEqual(pd_actual, pd_expected);
assert.strictEqual(ctx2[1], 5);
delete ctx2[1];
assert.strictEqual(ctx2[1], undefined);
{
  const ctx = vm.createContext();
  Object.defineProperty(ctx, 'prop', {
    get() {
      return undefined;
    },
    set(val) {
      throw new Error('test error');
    },
  });
  assert.throws(() => {
    vm.runInContext('prop = 42', ctx);
  }, {
    message: 'test error',
  });
}
