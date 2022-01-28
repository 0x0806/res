'use strict';
const assert = require('assert');
const fs = require('fs');
const emptyFile = fixtures.path('empty.txt');
fs.open(emptyFile, 'r', common.mustSucceed((fd) => {
  const read = fs.createReadStream(emptyFile, { fd });
  read.once('data', common.mustNotCall('data event should not emit'));
  read.once('end', common.mustCall());
}));
fs.open(emptyFile, 'r', common.mustSucceed((fd) => {
  const read = fs.createReadStream(emptyFile, { fd });
  read.pause();
  read.once('data', common.mustNotCall('data event should not emit'));
  read.once('end', common.mustNotCall('end event should not emit'));
  setTimeout(common.mustCall(() => {
    assert.strictEqual(read.isPaused(), true);
  }), common.platformTimeout(50));
}));
