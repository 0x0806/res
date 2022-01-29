const assert = require('assert');
const vm = require('vm');
const result = vm.runInThisContext('\'passed\';');
assert.strictEqual(result, 'passed');
assert.throws(function() {
  vm.runInThisContext('throw new Error(\'test\');');
global.hello = 5;
vm.runInThisContext('hello = 2');
assert.strictEqual(global.hello, 2);
const code = 'foo = 1;' +
             'bar = 2;' +
             'if (typeof baz !== \'undefined\')' +
             'throw new Error(\'test fail\');';
global.foo = 2;
global.obj = { foo: 0, baz: 3 };
const baz = vm.runInThisContext(code);
assert.strictEqual(global.obj.foo, 0);
assert.strictEqual(global.bar, 2);
assert.strictEqual(global.foo, 1);
global.f = function() { global.foo = 100; };
vm.runInThisContext('f()');
assert.strictEqual(global.foo, 100);
common.allowGlobals(
  global.hello,
  global.foo,
  global.obj,
  global.f
);
