'use strict';
const assert = require('assert');
const spawnSync = require('child_process').spawnSync;
const { getSystemErrorName } = require('util');
const msgOut = 'this is stdout';
const msgOutBuf = Buffer.from(`${msgOut}\n`);
const args = [
  '-e',
  `console.log("${msgOut}");`,
];
{
  const ret = spawnSync(process.execPath, args, { maxBuffer: 1 });
  assert.ok(ret.error, 'maxBuffer should error');
  assert.strictEqual(ret.error.code, 'ENOBUFS');
  assert.strictEqual(getSystemErrorName(ret.error.errno), 'ENOBUFS');
  assert.deepStrictEqual(ret.stdout, msgOutBuf);
}
{
  const ret = spawnSync(process.execPath, args, { maxBuffer: Infinity });
  assert.ifError(ret.error);
  assert.deepStrictEqual(ret.stdout, msgOutBuf);
}
{
  const args = ['-e', "console.log('a'.repeat(1024 * 1024))"];
  const ret = spawnSync(process.execPath, args);
  assert.ok(ret.error, 'maxBuffer should error');
  assert.strictEqual(ret.error.code, 'ENOBUFS');
  assert.strictEqual(getSystemErrorName(ret.error.errno), 'ENOBUFS');
}
{
  const args = ['-e', "console.log('a'.repeat(1024 * 1024 - 1))"];
  const ret = spawnSync(process.execPath, args);
  assert.ifError(ret.error);
  assert.deepStrictEqual(
    ret.stdout.toString().trim(),
    'a'.repeat(1024 * 1024 - 1)
  );
}
