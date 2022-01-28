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
    assert.strictEqual(signal, 'SIGINT');
    assert.strictEqual(code, null);
  }));
}
function main() {
  process.env.NODE_DISABLE_COLORS = '1';
  process.kill(process.pid, 'SIGINT');
  while (true) {}
}
