'use strict';
const assert = require('assert');
const { fork } = require('child_process');
const expectedEnv = { foo: 'bar' };
{
  const invalidModulePath = [
    0,
    true,
    undefined,
    null,
    [],
    {},
    () => {},
    Symbol('t'),
  ];
  invalidModulePath.forEach((modulePath) => {
    assert.throws(() => fork(modulePath), {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  });
  const cp = fork(fixtures.path('child-process-echo-options.js'));
  cp.on(
    'exit',
    common.mustCall((code) => {
      assert.strictEqual(code, 0);
    })
  );
}
{
  const invalidSecondArgs = [
    0,
    true,
    () => {},
    Symbol('t'),
  ];
  invalidSecondArgs.forEach((arg) => {
    assert.throws(
      () => {
        fork(fixtures.path('child-process-echo-options.js'), arg);
      },
      {
        code: 'ERR_INVALID_ARG_VALUE',
        name: 'TypeError'
      }
    );
  });
  const argsLists = [undefined, null, []];
  argsLists.forEach((args) => {
    const cp = fork(fixtures.path('child-process-echo-options.js'), args, {
      env: { ...process.env, ...expectedEnv }
    });
    cp.on(
      'message',
      common.mustCall(({ env }) => {
        assert.strictEqual(env.foo, expectedEnv.foo);
      })
    );
    cp.on(
      'exit',
      common.mustCall((code) => {
        assert.strictEqual(code, 0);
      })
    );
  });
}
{
  const invalidThirdArgs = [
    0,
    true,
    () => {},
    Symbol('t'),
  ];
  invalidThirdArgs.forEach((arg) => {
    assert.throws(
      () => {
        fork(fixtures.path('child-process-echo-options.js'), [], arg);
      },
      {
        code: 'ERR_INVALID_ARG_VALUE',
        name: 'TypeError'
      }
    );
  });
}
