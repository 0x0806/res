'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
if (common.isIBMi)
  common.skip('IBMi has a different behavior');
if (common.isWindows || process.getuid() !== 0) {
  assert.throws(() => {
    spawn('echo', ['fhqwhgads'], { uid: 0 });
  }, expectedError);
}
if (common.isWindows || !process.getgroups().some((gid) => gid === 0)) {
  assert.throws(() => {
    spawn('echo', ['fhqwhgads'], { gid: 0 });
  }, expectedError);
}
