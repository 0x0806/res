'use strict';
if (common.isWindows) {
  common.skip('platform not supported');
}
const assert = require('assert');
const vm = require('vm');
const spawn = require('child_process').spawn;
const methods = [
  'runInThisContext',
  'runInContext',
];
if (process.argv[2] === 'child') {
  const method = process.argv[3];
  assert.ok(method);
  let firstHandlerCalled = 0;
  process.on('SIGINT', common.mustCall(() => {
    firstHandlerCalled++;
  }, 2));
  let onceHandlerCalled = 0;
  process.once('SIGINT', common.mustCall(() => {
    onceHandlerCalled++;
  }));
  const script = `process.send('${method}'); while(true) {}`;
  const args = method === 'runInContext' ?
    [vm.createContext({ process })] :
    [];
  const options = { breakOnSigint: true };
  assert.throws(
    () => { vm[method](script, ...args, options); },
    {
      code: 'ERR_SCRIPT_EXECUTION_INTERRUPTED',
      message: 'Script execution was interrupted by `SIGINT`'
    });
  assert.strictEqual(firstHandlerCalled, 0);
  assert.strictEqual(onceHandlerCalled, 0);
  const timeout = setTimeout(() => {}, 1000);
  let afterHandlerCalled = 0;
  process.on('SIGINT', common.mustCall(() => {
    if (afterHandlerCalled++ === 0) {
      assert.strictEqual(firstHandlerCalled, 1);
      assert.strictEqual(onceHandlerCalled, 1);
      process.send(method);
      return;
    }
    assert.strictEqual(onceHandlerCalled, 1);
    assert.strictEqual(firstHandlerCalled, 2);
    timeout.unref();
  }, 2));
  process.send(method);
  return;
}
for (const method of methods) {
  const child = spawn(process.execPath, [__filename, 'child', method], {
    stdio: [null, 'inherit', 'inherit', 'ipc']
  });
  child.on('message', common.mustCall(() => {
    process.kill(child.pid, 'SIGINT');
  }, 3));
  child.on('close', common.mustCall((code, signal) => {
    assert.strictEqual(signal, null);
    assert.strictEqual(code, 0);
  }));
}
