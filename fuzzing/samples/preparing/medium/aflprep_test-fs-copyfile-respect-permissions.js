'use strict';
if (!common.isWindows && process.getuid() === 0)
  common.skip('as this test should not be run as `root`');
if (common.isIBMi)
  common.skip('IBMi has a different access permission mechanism');
tmpdir.refresh();
const assert = require('assert');
const fs = require('fs');
const path = require('path');
let n = 0;
function beforeEach() {
  n++;
  const source = path.join(tmpdir.path, `source${n}`);
  const dest = path.join(tmpdir.path, `dest${n}`);
  fs.writeFileSync(source, 'source');
  fs.writeFileSync(dest, 'dest');
  fs.chmodSync(dest, '444');
  const check = (err) => {
    const expected = ['EACCES', 'EPERM'];
    assert(expected.includes(err.code), `${err.code} not in ${expected}`);
    assert.strictEqual(fs.readFileSync(dest, 'utf8'), 'dest');
    return true;
  };
  return { source, dest, check };
}
{
  const { source, dest, check } = beforeEach();
  assert.throws(() => { fs.copyFileSync(source, dest); }, check);
}
{
  const { source, dest, check } = beforeEach();
  (async () => {
    await assert.rejects(fs.promises.copyFile(source, dest), check);
  })().then(common.mustCall());
}
{
  const { source, dest, check } = beforeEach();
  fs.copyFile(source, dest, common.mustCall(check));
}
