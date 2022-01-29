'use strict';
common.skipIfInspectorDisabled();
common.skipIf32Bits();
const { strictEqual } = require('assert');
const eyecatcher = 'nou, houdoe he?';
if (process.argv[2] === 'child') {
  const { Session } = require('inspector');
  const { promisify } = require('util');
  const { registerAsyncHook } = internalBinding('inspector');
  (async () => {
    let enabled = 0;
    registerAsyncHook(() => ++enabled, () => {});
    const session = new Session();
    session.connect();
    session.post = promisify(session.post);
    await session.post('Debugger.enable');
    strictEqual(enabled, 0);
    await session.post('Debugger.setAsyncCallStackDepth', { maxDepth: 42 });
    strictEqual(enabled, 1);
    throw new Error(eyecatcher);
  })().finally(common.mustCall());
} else {
  const { spawnSync } = require('child_process');
  const options = { encoding: 'utf8' };
  const proc = spawnSync(
    process.execPath, ['--expose-internals', __filename, 'child'], options);
  strictEqual(proc.status, 1);
  strictEqual(proc.signal, null);
  strictEqual(proc.stderr.includes(eyecatcher), true);
}
