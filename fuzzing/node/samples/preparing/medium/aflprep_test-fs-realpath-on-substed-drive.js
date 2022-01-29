'use strict';
if (!common.isWindows)
  common.skip('Test for Windows only');
const assert = require('assert');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;
let result;
const driveLetters = 'ABCDEFGHIJKLMNOPQRSTUWXYZ';
let drive;
let i;
for (i = 0; i < driveLetters.length; ++i) {
  drive = `${driveLetters[i]}:`;
  result = spawnSync('subst', [drive, fixtures.fixturesDir]);
  if (result.status === 0)
    break;
}
if (i === driveLetters.length)
  common.skip('Cannot create subst drive');
process.on('exit', function() {
});
const filename = `${drive}\\empty.js`;
const filenameBuffer = Buffer.from(filename);
result = fs.realpathSync(filename);
assert.strictEqual(result, filename);
result = fs.realpathSync(filename, 'buffer');
assert(Buffer.isBuffer(result));
assert(result.equals(filenameBuffer));
fs.realpath(filename, common.mustSucceed((result) => {
  assert.strictEqual(result, filename);
}));
fs.realpath(filename, 'buffer', common.mustSucceed((result) => {
  assert(Buffer.isBuffer(result));
  assert(result.equals(filenameBuffer));
}));
