'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const file = path.join(tmpdir.path, 'write.txt');
tmpdir.refresh();
{
  const stream = fs.WriteStream(file);
  const _fs_close = fs.close;
  fs.close = function(fd) {
    assert.ok(fd, 'fs.close must not be called without an undefined fd.');
    fs.close = _fs_close;
    fs.closeSync(fd);
  };
  stream.destroy();
}
{
  const stream = fs.createWriteStream(file);
  stream.on('drain', function() {
    assert.fail('\'drain\' event must not be emitted before ' +
                'stream.write() has been called at least once.');
  });
  stream.destroy();
}
{
  const stream = fs.createWriteStream(file);
  stream.on('error', common.mustNotCall());
  assert.throws(() => {
    stream.write(42);
  }, {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
  stream.destroy();
}
