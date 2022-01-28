'use strict';
const {
  join,
} = require('path');
const {
  closeSync,
  open,
  write,
  writeSync,
} = require('fs');
const assert = require('assert');
tmpdir.refresh();
const filename = join(tmpdir.path, 'test.txt');
open(filename, 'w+', common.mustSucceed((fd) => {
  assert.throws(() => {
    write(fd, Buffer.alloc(0), -1, common.mustNotCall());
  }, {
    code: 'ERR_OUT_OF_RANGE',
  });
  assert.throws(() => {
    writeSync(fd, Buffer.alloc(0), -1);
  }, {
    code: 'ERR_OUT_OF_RANGE',
  });
  closeSync(fd);
}));
const filename2 = join(tmpdir.path, 'test2.txt');
open(filename2, 'w+', common.mustSucceed((fd) => {
  assert.throws(() => {
    write(fd, Buffer.alloc(0), 0, -1, common.mustNotCall());
  }, {
    code: 'ERR_OUT_OF_RANGE',
  });
  assert.throws(() => {
    writeSync(fd, Buffer.alloc(0), 0, -1);
  }, {
    code: 'ERR_OUT_OF_RANGE',
  });
  closeSync(fd);
}));
