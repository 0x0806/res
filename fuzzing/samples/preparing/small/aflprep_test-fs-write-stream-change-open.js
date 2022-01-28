'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const file = path.join(tmpdir.path, 'write.txt');
tmpdir.refresh();
const stream = fs.WriteStream(file);
const _fs_close = fs.close;
const _fs_open = fs.open;
fs.open = function() {
  return _fs_open.apply(fs, arguments);
};
fs.close = function(fd) {
  assert.ok(fd, 'fs.close must not be called with an undefined fd.');
  fs.close = _fs_close;
  fs.open = _fs_open;
  fs.closeSync(fd);
};
stream.write('foo');
stream.end();
process.on('exit', function() {
  assert.strictEqual(fs.open, _fs_open);
});
