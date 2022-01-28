'use strict';
const fs = require('fs');
const { open } = fs.promises;
const path = require('path');
const assert = require('assert');
const tmpDir = tmpdir.path;
tmpdir.refresh();
async function validateFilePermission() {
  const filePath = path.resolve(tmpDir, 'tmp-chmod.txt');
  const fileHandle = await open(filePath, 'w+', 0o444);
  const statsBeforeMod = fs.statSync(filePath);
  assert.deepStrictEqual(statsBeforeMod.mode & 0o444, 0o444);
  let expectedAccess;
  const newPermissions = 0o765;
  if (common.isWindows) {
    expectedAccess = 0o664;
  } else {
    expectedAccess = newPermissions;
  }
  await fileHandle.chmod(newPermissions);
  const statsAfterMod = fs.statSync(filePath);
  assert.deepStrictEqual(statsAfterMod.mode & expectedAccess, expectedAccess);
  await fileHandle.close();
}
validateFilePermission().then(common.mustCall());
