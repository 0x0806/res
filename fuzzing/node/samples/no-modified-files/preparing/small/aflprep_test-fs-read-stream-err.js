'use strict';
const assert = require('assert');
const fs = require('fs');
const stream = fs.createReadStream(__filename, {
  bufferSize: 64
});
const err = new Error('BAM');
stream.on('error', common.mustCall((err_) => {
  process.nextTick(common.mustCall(() => {
    assert.strictEqual(stream.fd, null);
    assert.strictEqual(err_, err);
  }));
}));
fs.close = common.mustCall((fd_, cb) => {
  assert.strictEqual(fd_, stream.fd);
  process.nextTick(cb);
});
const read = fs.read;
fs.read = function() {
  read.apply(fs, arguments);
  fs.read = common.mustCall(function() {
    const cb = arguments[arguments.length - 1];
    process.nextTick(() => {
      cb(err);
    });
    fs.read = () => {
      throw new Error('BOOM!');
    };
  });
};
stream.on('data', (buf) => {
  stream.on('data', common.mustNotCall("no more 'data' events should follow"));
});
