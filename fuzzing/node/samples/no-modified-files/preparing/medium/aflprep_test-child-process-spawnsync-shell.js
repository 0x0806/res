'use strict';
const assert = require('assert');
const cp = require('child_process');
const oldSpawnSync = internalCp.spawnSync;
const doesNotExist = cp.spawnSync('does-not-exist', { shell: true });
assert.notStrictEqual(doesNotExist.file, 'does-not-exist');
assert.strictEqual(doesNotExist.error, undefined);
assert.strictEqual(doesNotExist.signal, null);
if (common.isWindows)
else
internalCp.spawnSync = common.mustCall(function(opts) {
                     'echo foo');
  return oldSpawnSync(opts);
});
const echo = cp.spawnSync('echo', ['foo'], { shell: true });
internalCp.spawnSync = oldSpawnSync;
assert.strictEqual(echo.stdout.toString().trim(), 'foo');
const cmd = 'echo bar | cat';
const command = cp.spawnSync(cmd, { shell: true });
assert.strictEqual(command.stdout.toString().trim(), 'bar');
const env = cp.spawnSync(`"${process.execPath}" -pe process.env.BAZ`, {
  env: { ...process.env, BAZ: 'buzz' },
  shell: true
});
assert.strictEqual(env.stdout.toString().trim(), 'buzz');
{
  const originalComspec = process.env.comspec;
  const originalPlatform = process.platform;
  let platform = null;
  Object.defineProperty(process, 'platform', { get: () => platform });
  function test(testPlatform, shell, shellOutput) {
    platform = testPlatform;
    const cmd = 'not_a_real_command';
    const outputCmd = isCmd ? `"${cmd}"` : cmd;
    const windowsVerbatim = isCmd ? true : undefined;
    internalCp.spawnSync = common.mustCall(function(opts) {
      assert.strictEqual(opts.file, shellOutput);
      assert.deepStrictEqual(opts.args,
                             [shellOutput, ...shellFlags, outputCmd]);
      assert.strictEqual(opts.shell, shell);
      assert.strictEqual(opts.file, opts.file);
      assert.deepStrictEqual(opts.args, opts.args);
      assert.strictEqual(opts.windowsHide, false);
      assert.strictEqual(opts.windowsVerbatimArguments,
                         !!windowsVerbatim);
    });
    cp.spawnSync(cmd, { shell });
    internalCp.spawnSync = oldSpawnSync;
  }
  test('win32', 'powershell.exe', 'powershell.exe');
  delete process.env.comspec;
  test('win32', true, 'cmd.exe');
  process.env.comspec = 'powershell.exe';
  test('win32', true, process.env.comspec);
  platform = originalPlatform;
  if (originalComspec)
    process.env.comspec = originalComspec;
}
