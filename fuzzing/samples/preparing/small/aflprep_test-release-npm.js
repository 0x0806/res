'use strict';
const assert = require('assert');
const child_process = require('child_process');
const path = require('path');
if (!releaseReg.test(process.version) || !common.hasCrypto) {
  common.skip('This test is only for release builds');
}
{
  const npmExec = child_process.spawnSync(process.execPath, [npmCli]);
  assert.strictEqual(npmExec.status, 1);
  const stderr = npmExec.stderr.toString();
  assert.strictEqual(stderr.length, 0, 'npm is not ready for this release ' +
                     'and is going to print warnings to users:\n' + stderr);
}
