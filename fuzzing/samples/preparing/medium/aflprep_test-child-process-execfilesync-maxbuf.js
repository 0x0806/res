'use strict';
const assert = require('assert');
const { getSystemErrorName } = require('util');
const { execFileSync } = require('child_process');
const msgOut = 'this is stdout';
const msgOutBuf = Buffer.from(`${msgOut}\n`);
const args = [
  '-e',
  `console.log("${msgOut}");`,
];
{
  assert.throws(() => {
    execFileSync(process.execPath, args, { maxBuffer: 1 });
  }, (e) => {
    assert.ok(e, 'maxBuffer should error');
    assert.strictEqual(e.code, 'ENOBUFS');
    assert.strictEqual(getSystemErrorName(e.errno), 'ENOBUFS');
    assert.deepStrictEqual(e.stdout, msgOutBuf);
    return true;
  });
}
{
  const ret = execFileSync(process.execPath, args, { maxBuffer: Infinity });
  assert.deepStrictEqual(ret, msgOutBuf);
}
{
  assert.throws(() => {
    execFileSync(
      process.execPath,
      ['-e', "console.log('a'.repeat(1024 * 1024))"]
    );
  }, (e) => {
    assert.ok(e, 'maxBuffer should error');
    assert.strictEqual(e.code, 'ENOBUFS');
    assert.strictEqual(getSystemErrorName(e.errno), 'ENOBUFS');
    return true;
  });
}
