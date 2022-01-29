'use strict';
const assert = require('assert');
const Script = require('vm').Script;
{
  const script = new Script('\'passed\';');
  const result1 = script.runInNewContext();
  const result2 = script.runInNewContext();
  assert.strictEqual(result1, 'passed');
  assert.strictEqual(result2, 'passed');
}
{
  const script = new Script('throw new Error(\'test\');');
  assert.throws(() => {
    script.runInNewContext();
}
{
  const script = new Script('foo.bar = 5;');
  assert.throws(() => {
    script.runInNewContext();
}
{
  global.hello = 5;
  const script = new Script('hello = 2');
  script.runInNewContext();
  assert.strictEqual(global.hello, 5);
  delete global.hello;
}
{
  global.code = 'foo = 1;' +
                'bar = 2;' +
                'if (baz !== 3) throw new Error(\'test fail\');';
  global.foo = 2;
  global.obj = { foo: 0, baz: 3 };
  const script = new Script(global.code);
  const baz = script.runInNewContext(global.obj);
  assert.strictEqual(global.obj.foo, 1);
  assert.strictEqual(global.obj.bar, 2);
  assert.strictEqual(global.foo, 2);
  delete global.code;
  delete global.foo;
  delete global.obj;
}
{
  const script = new Script('f()');
  function changeFoo() { global.foo = 100; }
  script.runInNewContext({ f: changeFoo });
  assert.strictEqual(global.foo, 100);
  delete global.foo;
}
{
  const script = new Script('f.a = 2');
  const f = { a: 1 };
  script.runInNewContext({ f });
  assert.strictEqual(f.a, 2);
  assert.throws(() => {
    script.runInNewContext();
}
{
  const script = new Script('');
  assert.throws(() => {
    script.runInNewContext.call('\'hello\';');
}
