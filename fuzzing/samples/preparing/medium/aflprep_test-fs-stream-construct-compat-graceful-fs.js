'use strict';
const fs = require('fs');
const assert = require('assert');
tmpdir.refresh();
{
  function ReadStream(...args) {
    fs.ReadStream.call(this, ...args);
  }
  Object.setPrototypeOf(ReadStream.prototype, fs.ReadStream.prototype);
  Object.setPrototypeOf(ReadStream, fs.ReadStream);
  ReadStream.prototype.open = common.mustCall(function ReadStream$open() {
    const that = this;
    fs.open(that.path, that.flags, that.mode, (err, fd) => {
      if (err) {
        if (that.autoClose)
          that.destroy();
        that.emit('error', err);
      } else {
        that.fd = fd;
        that.emit('open', fd);
        that.read();
      }
    });
  });
  const r = new ReadStream(fixtures.path('x.txt'))
    .on('open', common.mustCall((fd) => {
      assert.strictEqual(fd, r.fd);
      r.destroy();
    }));
}
{
  function WriteStream(...args) {
    fs.WriteStream.call(this, ...args);
  }
  Object.setPrototypeOf(WriteStream.prototype, fs.WriteStream.prototype);
  Object.setPrototypeOf(WriteStream, fs.WriteStream);
  WriteStream.prototype.open = common.mustCall(function WriteStream$open() {
    const that = this;
    fs.open(that.path, that.flags, that.mode, function(err, fd) {
      if (err) {
        that.destroy();
        that.emit('error', err);
      } else {
        that.fd = fd;
        that.emit('open', fd);
      }
    });
  });
    .on('open', common.mustCall((fd) => {
      assert.strictEqual(fd, w.fd);
      w.destroy();
    }));
}
