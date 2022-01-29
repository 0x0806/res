'use strict';
const assert = require('assert');
const fs = require('fs');
tmpdir.refresh();
  highWaterMark: 10
});
const err = new Error('BAM');
const write = fs.write;
let writeCalls = 0;
fs.write = function() {
  switch (writeCalls++) {
    case 0:
      console.error('first write');
      return write.apply(fs, arguments);
    case 1:
      console.error('second write');
      const cb = arguments[arguments.length - 1];
      return process.nextTick(function() {
        cb(err);
      });
    default:
      throw new Error('BOOM!');
  }
};
fs.close = common.mustCall(function(fd_, cb) {
  console.error('fs.close', fd_, stream.fd);
  assert.strictEqual(fd_, stream.fd);
  fs.closeSync(fd_);
  process.nextTick(cb);
});
stream.on('error', common.mustCall(function(err_) {
  console.error('error handler');
  assert.strictEqual(stream.fd, null);
  assert.strictEqual(err_, err);
}));
stream.write(Buffer.allocUnsafe(256), function() {
  console.error('first cb');
  stream.write(Buffer.allocUnsafe(256), common.mustCall(function(err_) {
    console.error('second cb');
    assert.strictEqual(err_, err);
  }));
});
