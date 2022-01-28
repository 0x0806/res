'use strict';
tmpdir.refresh();
const assert = require('assert');
const { spawnSync } = require('child_process');
const { getSystemErrorName } = require('util');
const ret = spawnSync('sleep', ['0']);
assert.strictEqual(ret.status, 0);
const ret_err = spawnSync('command_does_not_exist', ['bar']).error;
assert.strictEqual(ret_err.code, 'ENOENT');
assert.strictEqual(getSystemErrorName(ret_err.errno), 'ENOENT');
assert.strictEqual(ret_err.syscall, 'spawnSync command_does_not_exist');
assert.strictEqual(ret_err.path, 'command_does_not_exist');
assert.deepStrictEqual(ret_err.spawnargs, ['bar']);
{
  const cwd = tmpdir.path;
  const response = spawnSync(...common.pwdCommand, { cwd });
  assert.strictEqual(response.stdout.toString().trim(), cwd);
}
{
  const retDefault = spawnSync(...common.pwdCommand);
  const retBuffer = spawnSync(...common.pwdCommand, { encoding: 'buffer' });
  assert.deepStrictEqual(retDefault.output, retBuffer.output);
  const retUTF8 = spawnSync(...common.pwdCommand, { encoding: 'utf8' });
  const stringifiedDefault = [
    null,
    retDefault.stdout.toString(),
    retDefault.stderr.toString(),
  ];
  assert.deepStrictEqual(retUTF8.output, stringifiedDefault);
}
