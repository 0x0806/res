'use strict';
const assert = require('assert');
const cp = require('child_process');
if (process.argv[2] === 'child') {
  setTimeout(() => {
    console.log('child stdout');
    console.error('child stderr');
  }, common.platformTimeout(1000));
  return;
}
const cmd = `"${process.execPath}" "${__filename}" child`;
cp.exec(cmd, { timeout: 1 }, common.mustCall((err, stdout, stderr) => {
  let sigterm = 'SIGTERM';
  assert.strictEqual(err.killed, true);
  if (common.isOpenBSD) {
    assert.strictEqual(err.code, 143);
    sigterm = null;
  } else {
    assert.strictEqual(err.code, null);
  }
  if (common.isOSX)
    assert.ok(err.signal === 'SIGTERM' || err.signal === 'SIGKILL');
  else
    assert.strictEqual(err.signal, sigterm);
  assert.strictEqual(err.cmd, cmd);
  assert.strictEqual(stdout.trim(), '');
  assert.strictEqual(stderr.trim(), '');
}));
cp.exec(cmd, {
  timeout: 1,
  killSignal: 'SIGKILL'
}, common.mustCall((err, stdout, stderr) => {
  assert.strictEqual(err.killed, true);
  assert.strictEqual(err.code, null);
  assert.strictEqual(err.signal, 'SIGKILL');
  assert.strictEqual(err.cmd, cmd);
  assert.strictEqual(stdout.trim(), '');
  assert.strictEqual(stderr.trim(), '');
}));
cp.exec(cmd, { timeout: 2 ** 30 }, common.mustSucceed((stdout, stderr) => {
  assert.strictEqual(stdout.trim(), 'child stdout');
  assert.strictEqual(stderr.trim(), 'child stderr');
}));
if (common.isWindows) {
  process.once('beforeExit', () => {
    cp.execFileSync(`${process.env.SystemRoot}\\System32\\wbem\\WMIC.exe`, [
      'process',
      'where',
      `commandline like '%${basename}%child'`,
      'delete',
    ]);
  });
}
