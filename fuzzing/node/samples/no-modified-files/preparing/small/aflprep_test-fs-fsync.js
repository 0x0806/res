'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const fileFixture = fixtures.path('a.js');
const fileTemp = path.join(tmpdir.path, 'a.js');
tmpdir.refresh();
fs.copyFileSync(fileFixture, fileTemp);
fs.open(fileTemp, 'a', 0o777, common.mustSucceed((fd) => {
  fs.fdatasyncSync(fd);
  fs.fsyncSync(fd);
  fs.fdatasync(fd, common.mustSucceed(() => {
    fs.fsync(fd, common.mustSucceed(() => {
      fs.closeSync(fd);
    }));
  }));
}));
['', false, null, undefined, {}, []].forEach((input) => {
  const errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  };
  assert.throws(() => fs.fdatasync(input), errObj);
  assert.throws(() => fs.fdatasyncSync(input), errObj);
  assert.throws(() => fs.fsync(input), errObj);
  assert.throws(() => fs.fsyncSync(input), errObj);
});
