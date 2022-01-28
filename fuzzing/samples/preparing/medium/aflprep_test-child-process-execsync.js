'use strict';
tmpdir.refresh();
const assert = require('assert');
const { execFileSync, execSync, spawnSync } = require('child_process');
const { getSystemErrorName } = require('util');
const TIMER = 200;
const SLEEP = 2000;
const execOpts = { encoding: 'utf8', shell: true };
assert.throws(
  function() { execSync('exit -1', { shell: 'bad_shell' }); },
);
assert.throws(
  function() { execFileSync('exit -1', { shell: 'bad_shell' }); },
);
let caught = false;
let ret, err;
const start = Date.now();
try {
  const cmd = `"${process.execPath}" -e "setTimeout(function(){}, ${SLEEP});"`;
  ret = execSync(cmd, { timeout: TIMER });
} catch (e) {
  caught = true;
  assert.strictEqual(getSystemErrorName(e.errno), 'ETIMEDOUT');
  err = e;
} finally {
  assert.strictEqual(ret, undefined,
                     `should not have a return value, received ${ret}`);
  assert.ok(caught, 'execSync should throw');
  const end = Date.now() - start;
  assert(end < SLEEP);
  assert(err.status > 128 || err.signal);
}
assert.throws(function() {
  execSync('iamabadcommand');
const msg = 'foobar';
const msgBuf = Buffer.from(`${msg}\n`);
const cmd = `"${process.execPath}" -e "console.log('${msg}');"`;
{
  const ret = execSync(cmd);
  assert.strictEqual(ret.length, msgBuf.length);
  assert.deepStrictEqual(ret, msgBuf);
}
{
  const ret = execSync(cmd, { encoding: 'utf8' });
  assert.strictEqual(ret, `${msg}\n`);
}
const args = [
  '-e',
  `console.log("${msg}");`,
];
{
  const ret = execFileSync(process.execPath, args);
  assert.deepStrictEqual(ret, msgBuf);
}
{
  const ret = execFileSync(process.execPath, args, { encoding: 'utf8' });
  assert.strictEqual(ret, `${msg}\n`);
}
{
  const cwd = tmpdir.path;
  const cmd = common.isWindows ? 'echo %cd%' : 'pwd';
  const response = execSync(cmd, { cwd });
  assert.strictEqual(response.toString().trim(), cwd);
}
{
  assert.throws(function() {
    execSync('exit -1', { stdio: 'ignore' });
}
{
  const args = ['-e', 'process.exit(1)'];
  const spawnSyncResult = spawnSync(process.execPath, args);
  const spawnSyncKeys = Object.keys(spawnSyncResult).sort();
  assert.deepStrictEqual(spawnSyncKeys, [
    'output',
    'pid',
    'signal',
    'status',
    'stderr',
    'stdout',
  ]);
  assert.throws(() => {
    execFileSync(process.execPath, args);
  }, (err) => {
    const msg = `Command failed: ${process.execPath} ${args.join(' ')}`;
    assert(err instanceof Error);
    assert.strictEqual(err.message, msg);
    assert.strictEqual(err.status, 1);
    assert.strictEqual(typeof err.pid, 'number');
    spawnSyncKeys
      .filter((key) => key !== 'pid')
      .forEach((key) => {
        assert.deepStrictEqual(err[key], spawnSyncResult[key]);
      });
    return true;
  });
}
execFileSync(process.execPath, [], execOpts);
