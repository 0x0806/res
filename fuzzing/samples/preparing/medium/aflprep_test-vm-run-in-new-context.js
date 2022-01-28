'use strict';
const assert = require('assert');
const vm = require('vm');
if (typeof global.gc !== 'function')
  assert.fail('Run this test with --expose-gc');
const result = vm.runInNewContext('\'passed\';');
assert.strictEqual(result, 'passed');
assert.throws(() => {
  vm.runInNewContext('throw new Error(\'test\');');
global.hello = 5;
vm.runInNewContext('hello = 2');
assert.strictEqual(global.hello, 5);
global.code = 'foo = 1;' +
              'bar = 2;' +
              'if (baz !== 3) throw new Error(\'test fail\');';
global.foo = 2;
global.obj = { foo: 0, baz: 3 };
const baz = vm.runInNewContext(global.code, global.obj);
assert.strictEqual(global.obj.foo, 1);
assert.strictEqual(global.obj.bar, 2);
assert.strictEqual(global.foo, 2);
function changeFoo() { global.foo = 100; }
vm.runInNewContext('f()', { f: changeFoo });
assert.strictEqual(global.foo, 100);
const f = { a: 1 };
vm.runInNewContext('f.a = 2', { f });
assert.strictEqual(f.a, 2);
const fn = vm.runInNewContext('(function() { obj.p = {}; })', { obj: {} });
global.gc();
fn();
const filename = 'test_file.vm';
for (const arg of [filename, { filename }]) {
  const code = 'throw new Error("foo");';
  assert.throws(() => {
    vm.runInNewContext(code, {}, arg);
  }, (err) => {
    const lines = err.stack.split('\n');
    assert.strictEqual(lines[0].trim(), `${filename}:1`);
    assert.strictEqual(lines[1].trim(), code);
    assert.strictEqual(lines[4].trim(), 'Error: foo');
    assert.strictEqual(lines[5].trim(), `at ${filename}:1:7`);
    return true;
  });
}
common.allowGlobals(
  global.hello,
  global.code,
  global.foo,
  global.obj
);
