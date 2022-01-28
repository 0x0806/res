'use strict';
const assert = require('assert');
const Script = require('vm').Script;
let script = new Script('\'passed\';');
const result = script.runInThisContext(script);
assert.strictEqual(result, 'passed');
script = new Script('throw new Error(\'test\');');
assert.throws(() => {
  script.runInThisContext(script);
global.hello = 5;
script = new Script('hello = 2');
script.runInThisContext(script);
assert.strictEqual(global.hello, 2);
global.code = 'foo = 1;' +
              'bar = 2;' +
              'if (typeof baz !== "undefined") throw new Error("test fail");';
global.foo = 2;
global.obj = { foo: 0, baz: 3 };
script = new Script(global.code);
script.runInThisContext(script);
assert.strictEqual(global.obj.foo, 0);
assert.strictEqual(global.bar, 2);
assert.strictEqual(global.foo, 1);
global.f = function() { global.foo = 100; };
script = new Script('f()');
script.runInThisContext(script);
assert.strictEqual(global.foo, 100);
common.allowGlobals(
  global.hello,
  global.code,
  global.foo,
  global.obj,
  global.f
);
