'use strict';
const assert = require('assert');
const fs = require('fs');
const fn = fixtures.path('empty.txt');
const join = require('path').join;
tmpdir.refresh();
tempFd(function(fd, close) {
  fs.readFile(fd, function(err, data) {
    assert.ok(data);
    close();
  });
});
tempFd(function(fd, close) {
  fs.readFile(fd, 'utf8', function(err, data) {
    assert.strictEqual(data, '');
    close();
  });
});
tempFdSync(function(fd) {
  assert.ok(fs.readFileSync(fd));
});
tempFdSync(function(fd) {
  assert.strictEqual(fs.readFileSync(fd, 'utf8'), '');
});
function tempFd(callback) {
  fs.open(fn, 'r', function(err, fd) {
    assert.ifError(err);
    callback(fd, function() {
      fs.close(fd, function(err) {
        assert.ifError(err);
      });
    });
  });
}
function tempFdSync(callback) {
  const fd = fs.openSync(fn, 'r');
  callback(fd);
  fs.closeSync(fd);
}
{
  const filename = join(tmpdir.path, 'test.txt');
  fs.writeFileSync(filename, 'Hello World');
  {
    const fd = fs.openSync(filename, 'r');
    const buf = Buffer.alloc(5);
    assert.deepStrictEqual(fs.readSync(fd, buf, 0, 5), 5);
    assert.deepStrictEqual(buf.toString(), 'Hello');
    assert.deepStrictEqual(fs.readFileSync(fd).toString(), ' World');
    fs.closeSync(fd);
  }
  {
    fs.open(filename, 'r', common.mustSucceed((fd) => {
      const buf = Buffer.alloc(5);
      fs.read(fd, buf, 0, 5, null, common.mustSucceed((bytes) => {
        assert.strictEqual(bytes, 5);
        assert.deepStrictEqual(buf.toString(), 'Hello');
        fs.readFile(fd, common.mustSucceed((data) => {
          assert.deepStrictEqual(data.toString(), ' World');
          fs.closeSync(fd);
        }));
      }));
    }));
  }
}
