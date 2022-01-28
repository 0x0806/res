'use strict';
const assert = require('assert');
const vm = require('vm');
for (const valToTest of [
  'string', null, undefined, 8.9, Symbol('sym'), true,
]) {
  assert.throws(() => {
    vm.isContext(valToTest);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
}
assert.strictEqual(vm.isContext({}), false);
assert.strictEqual(vm.isContext([]), false);
assert.strictEqual(vm.isContext(vm.createContext()), true);
assert.strictEqual(vm.isContext(vm.createContext([])), true);
const sandbox = { foo: 'bar' };
vm.createContext(sandbox);
assert.strictEqual(vm.isContext(sandbox), true);
