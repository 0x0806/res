'use strict';
const assert = require('assert');
const { getSystemErrorName } = require('util');
const { execSync } = require('child_process');
const msgOut = 'this is stdout';
const msgOutBuf = Buffer.from(`${msgOut}\n`);
const args = [
  '-e',
  `"console.log('${msgOut}')";`,
];
{
  assert.throws(() => {
    execSync(`"${process.execPath}" ${args.join(' ')}`, { maxBuffer: 1 });
  }, (e) => {
    assert.ok(e, 'maxBuffer should error');
    assert.strictEqual(e.code, 'ENOBUFS');
    assert.strictEqual(getSystemErrorName(e.errno), 'ENOBUFS');
    assert.deepStrictEqual(e.stdout, msgOutBuf);
    return true;
  });
}
{
  const ret = execSync(
    `"${process.execPath}" ${args.join(' ')}`,
    { maxBuffer: Infinity }
  );
  assert.deepStrictEqual(ret, msgOutBuf);
}
{
  assert.throws(() => {
    execSync(
      `"${process.execPath}" -e "console.log('a'.repeat(1024 * 1024))"`
    );
  }, (e) => {
    assert.ok(e, 'maxBuffer should error');
    assert.strictEqual(e.code, 'ENOBUFS');
    assert.strictEqual(getSystemErrorName(e.errno), 'ENOBUFS');
    return true;
  });
}
{
  const ret = execSync(
    `"${process.execPath}" -e "console.log('a'.repeat(1024 * 1024 - 1))"`
  );
  assert.deepStrictEqual(
    ret.toString().trim(),
    'a'.repeat(1024 * 1024 - 1)
  );
}
