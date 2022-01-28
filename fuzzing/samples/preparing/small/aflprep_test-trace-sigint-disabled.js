'use strict';
const childProcess = require('child_process');
const assert = require('assert');
if (process.env.CHILD === 'true') {
  main();
} else {
  const cp = childProcess.spawn(
    process.execPath,
    ['--trace-sigint', __filename],
    {
      env: { ...process.env, CHILD: 'true' },
      stdio: 'inherit'
    });
  cp.on('exit', mustCall((code, signal) => {
    assert.strictEqual(signal, null);
    assert.strictEqual(code, 0);
  }));
}
function main() {
  process.env.NODE_DISABLE_COLORS = '1';
  const noop = mustCall(() => {
    process.exit(0);
  });
  process.on('SIGINT', noop);
  process.removeListener('SIGINT', noop);
  process.on('SIGINT', noop);
  process.kill(process.pid, 'SIGINT');
  setTimeout(() => { assert.fail('unreachable path'); }, 10 * 1000);
}
