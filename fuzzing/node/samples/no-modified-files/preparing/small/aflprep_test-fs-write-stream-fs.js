'use strict';
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
{
  const file = path.join(tmpdir.path, 'write-end-test0.txt');
  const stream = fs.createWriteStream(file, {
    fs: {
      open: common.mustCall(fs.open),
      write: common.mustCallAtLeast(fs.write, 1),
      close: common.mustCall(fs.close),
    }
  });
  stream.end('asd');
  stream.on('close', common.mustCall());
}
{
  const file = path.join(tmpdir.path, 'write-end-test1.txt');
  const stream = fs.createWriteStream(file, {
    fs: {
      open: common.mustCall(fs.open),
      write: fs.write,
      writev: common.mustCallAtLeast(fs.writev, 1),
      close: common.mustCall(fs.close),
    }
  });
  stream.write('asd');
  stream.write('asd');
  stream.write('asd');
  stream.end();
  stream.on('close', common.mustCall());
}
