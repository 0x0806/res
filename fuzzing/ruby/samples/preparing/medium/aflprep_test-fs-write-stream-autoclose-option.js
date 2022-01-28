'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const file = path.join(tmpdir.path, 'write-autoclose-opt1.txt');
tmpdir.refresh();
let stream = fs.createWriteStream(file, { flags: 'w+', autoClose: false });
stream.write('Test1');
stream.end();
stream.on('finish', common.mustCall(function() {
  stream.on('close', common.mustNotCall());
  process.nextTick(common.mustCall(function() {
    assert.strictEqual(stream.closed, false);
    assert.notStrictEqual(stream.fd, null);
    next();
  }));
}));
function next() {
  stream = fs.createWriteStream(null, { fd: stream.fd, start: 0 });
  stream.write('Test2');
  stream.end();
  stream.on('finish', common.mustCall(function() {
    assert.strictEqual(stream.closed, false);
    stream.on('close', common.mustCall(function() {
      assert.strictEqual(stream.fd, null);
      assert.strictEqual(stream.closed, true);
      process.nextTick(next2);
    }));
  }));
}
function next2() {
  fs.readFile(file, function(err, data) {
    assert.ifError(err);
    assert.strictEqual(data.toString(), 'Test2');
    process.nextTick(common.mustCall(next3));
  });
}
function next3() {
  const stream = fs.createWriteStream(file, { autoClose: true });
  stream.write('Test3');
  stream.end();
  stream.on('finish', common.mustCall(function() {
    assert.strictEqual(stream.closed, false);
    stream.on('close', common.mustCall(function() {
      assert.strictEqual(stream.fd, null);
      assert.strictEqual(stream.closed, true);
    }));
  }));
}
