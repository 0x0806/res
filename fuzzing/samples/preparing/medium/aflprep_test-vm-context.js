'use strict';
const assert = require('assert');
const vm = require('vm');
const Script = vm.Script;
let script = new Script('"passed";');
let context = vm.createContext();
let result = script.runInContext(context);
assert.strictEqual(result, 'passed');
context = vm.createContext({ 'foo': 'bar', 'thing': 'lala' });
assert.strictEqual(context.foo, 'bar');
assert.strictEqual(context.thing, 'lala');
script = new Script('foo = 3;');
result = script.runInContext(context);
assert.strictEqual(context.foo, 3);
assert.strictEqual(context.thing, 'lala');
assert.throws(() => {
  vm.runInNewContext('', null, 'some.js');
}, {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
});
let gh1140Exception;
try {
  vm.runInContext('throw new Error()', context, 'expected-filename.js');
} catch (e) {
  gh1140Exception = e;
}
assert.strictEqual(gh1140Exception.toString(), 'Error');
const nonContextualObjectError = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
};
const contextifiedObjectError = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError',
};
[
  [undefined, nonContextualObjectError],
  [null, nonContextualObjectError],
  [0, nonContextualObjectError],
  [0.0, nonContextualObjectError],
  ['', nonContextualObjectError],
  [{}, contextifiedObjectError],
  [[], contextifiedObjectError],
].forEach((e) => {
  assert.throws(() => { script.runInContext(e[0]); }, e[1]);
  assert.throws(() => { vm.runInContext('', e[0]); }, e[1]);
});
script = vm.createScript('const assert = require(\'assert\'); assert.throws(' +
                         'some.js');
script.runInNewContext({ require });
script = vm.createScript('delete b');
let ctx = {};
Object.defineProperty(ctx, 'b', { configurable: false });
ctx = vm.createContext(ctx);
assert.strictEqual(script.runInContext(ctx), false);
{
  let stack = null;
  assert.throws(() => {
    vm.runInContext(' throw new Error()', context, {
      filename: 'expected-filename.js',
      lineOffset: 32,
      columnOffset: 123
    });
  }, (err) => {
    stack = err.stack;
  }, `stack not formatted as expected: ${stack}`);
}
ctx = new Proxy({}, {});
assert.strictEqual(typeof vm.runInNewContext('String', ctx), 'function');
