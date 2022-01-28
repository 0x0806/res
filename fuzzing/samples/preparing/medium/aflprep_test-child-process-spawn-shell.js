'use strict';
const assert = require('assert');
const cp = require('child_process');
const doesNotExist = cp.spawn('does-not-exist', { shell: true });
assert.notStrictEqual(doesNotExist.spawnfile, 'does-not-exist');
doesNotExist.on('error', common.mustNotCall());
doesNotExist.on('exit', common.mustCall((code, signal) => {
  assert.strictEqual(signal, null);
  if (common.isWindows)
  else
}));
const echo = cp.spawn('echo', ['foo'], {
  encoding: 'utf8',
  shell: true
});
let echoOutput = '';
                   'echo foo');
echo.stdout.on('data', (data) => {
  echoOutput += data;
});
echo.on('close', common.mustCall((code, signal) => {
  assert.strictEqual(echoOutput.trim(), 'foo');
}));
const cmd = 'echo bar | cat';
const command = cp.spawn(cmd, {
  encoding: 'utf8',
  shell: true
});
let commandOutput = '';
command.stdout.on('data', (data) => {
  commandOutput += data;
});
command.on('close', common.mustCall((code, signal) => {
  assert.strictEqual(commandOutput.trim(), 'bar');
}));
const env = cp.spawn(`"${process.execPath}" -pe process.env.BAZ`, {
  env: { ...process.env, BAZ: 'buzz' },
  encoding: 'utf8',
  shell: true
});
let envOutput = '';
env.stdout.on('data', (data) => {
  envOutput += data;
});
env.on('close', common.mustCall((code, signal) => {
  assert.strictEqual(envOutput.trim(), 'buzz');
}));
