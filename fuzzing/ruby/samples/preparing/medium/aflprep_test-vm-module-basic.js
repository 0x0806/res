'use strict';
const assert = require('assert');
const {
  Module,
  SourceTextModule,
  SyntheticModule,
  createContext,
  compileFunction,
} = require('vm');
const util = require('util');
(async function test1() {
  const context = createContext({
    foo: 'bar',
    baz: undefined,
    typeofProcess: undefined,
  });
  const m = new SourceTextModule(
    'baz = foo; typeofProcess = typeof process; typeof Object;',
    { context }
  );
  assert.strictEqual(m.status, 'unlinked');
  await m.link(common.mustNotCall());
  assert.strictEqual(m.status, 'linked');
  assert.strictEqual(await m.evaluate(), undefined);
  assert.strictEqual(m.status, 'evaluated');
  assert.deepStrictEqual(context, {
    foo: 'bar',
    baz: 'bar',
    typeofProcess: 'undefined'
  });
}().then(common.mustCall()));
(async () => {
  const m = new SourceTextModule(`
    global.vmResultFoo = "foo";
    global.vmResultTypeofProcess = Object.prototype.toString.call(process);
  `);
  await m.link(common.mustNotCall());
  await m.evaluate();
  assert.strictEqual(global.vmResultFoo, 'foo');
  assert.strictEqual(global.vmResultTypeofProcess, '[object process]');
  delete global.vmResultFoo;
  delete global.vmResultTypeofProcess;
})().then(common.mustCall());
(async () => {
  const m = new SourceTextModule('while (true) {}');
  await m.link(common.mustNotCall());
  await m.evaluate({ timeout: 500 })
    .then(() => assert(false), () => {});
})().then(common.mustCall());
(async () => {
  const context1 = createContext({ });
  const context2 = createContext({ });
  const m1 = new SourceTextModule('1', { context: context1 });
  assert.strictEqual(m1.identifier, 'vm:module(0)');
  const m2 = new SourceTextModule('2', { context: context1 });
  assert.strictEqual(m2.identifier, 'vm:module(1)');
  const m3 = new SourceTextModule('3', { context: context2 });
  assert.strictEqual(m3.identifier, 'vm:module(0)');
})().then(common.mustCall());
{
  const context = createContext({ foo: 'bar' });
  const m = new SourceTextModule('1', { context });
  assert.strictEqual(
    util.inspect(m),
    `SourceTextModule {
  status: 'unlinked',
  identifier: 'vm:module(0)',
  context: { foo: 'bar' }
}`
  );
  assert.strictEqual(util.inspect(m, { depth: -1 }), '[SourceTextModule]');
  assert.throws(
    () => m[util.inspect.custom].call(Object.create(null)),
    {
      code: 'ERR_VM_MODULE_NOT_MODULE',
      message: 'Provided module is not an instance of Module'
    },
  );
}
{
  const context = createContext({ foo: 'bar' });
  const m = new SyntheticModule([], () => {}, { context });
  assert.strictEqual(
    util.inspect(m),
    `SyntheticModule {
  status: 'unlinked',
  identifier: 'vm:module(0)',
  context: { foo: 'bar' }
}`
  );
  assert.strictEqual(util.inspect(m, { depth: -1 }), '[SyntheticModule]');
}
{
  const m = new SourceTextModule('');
  const dep = m.dependencySpecifiers;
  assert.notStrictEqual(dep, undefined);
  assert.strictEqual(dep, m.dependencySpecifiers);
}
{
  assert.throws(() => new Module(), {
    message: 'Module is not a constructor',
    name: 'TypeError'
  });
}
{
  assert.throws(() => new SyntheticModule(undefined, () => {}, {}), {
    message: 'The "exportNames" argument must be an ' +
        'Array of unique strings.' +
        ' Received undefined',
    name: 'TypeError'
  });
}
{
  assert.throws(() => new SyntheticModule(['x', 'x'], () => {}, {}), {
    message: 'The property \'exportNames.x\' is duplicated. Received \'x\'',
    name: 'TypeError',
  });
}
{
  assert.throws(() => new SyntheticModule([], undefined, {}), {
    message: 'The "evaluateCallback" argument must be of type function.' +
      ' Received undefined',
    name: 'TypeError'
  });
}
{
  assert.throws(() => new SyntheticModule([], () => {}, null), {
    message: 'The "options" argument must be of type object.' +
      ' Received null',
    name: 'TypeError'
  });
}
{
  const module = new SyntheticModule([], () => {});
  module.link(() => {});
  const f = compileFunction('return import("x")', [], {
    importModuleDynamically(specifier, referrer) {
      assert.strictEqual(specifier, 'x');
      assert.strictEqual(referrer, f);
      return module;
    },
  });
  f().then((ns) => {
    assert.strictEqual(ns, module.namespace);
  });
}
