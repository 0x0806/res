'use strict';
if (!common.isWindows && process.getuid() === 0)
  common.skip('as this test should not be run as `root`');
if (common.isIBMi)
  common.skip('IBMi has a different access permission mechanism');
tmpdir.refresh();
const assert = require('assert');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
let n = 0;
function makeDirectoryReadOnly(dir) {
  let accessErrorCode = 'EACCES';
  if (common.isWindows) {
    accessErrorCode = 'EPERM';
  } else {
    fs.chmodSync(dir, '444');
  }
  return accessErrorCode;
}
function makeDirectoryWritable(dir) {
  if (common.isWindows) {
  }
}
{
  const dir = path.join(tmpdir.path, `mkdirp_${n++}`);
  fs.mkdirSync(dir);
  const codeExpected = makeDirectoryReadOnly(dir);
  let err = null;
  try {
  } catch (_err) {
    err = _err;
  }
  makeDirectoryWritable(dir);
  assert(err);
  assert.strictEqual(err.code, codeExpected);
  assert(err.path);
}
{
  const dir = path.join(tmpdir.path, `mkdirp_${n++}`);
  fs.mkdirSync(dir);
  const codeExpected = makeDirectoryReadOnly(dir);
    makeDirectoryWritable(dir);
    assert(err);
    assert.strictEqual(err.code, codeExpected);
    assert(err.path);
  });
}
