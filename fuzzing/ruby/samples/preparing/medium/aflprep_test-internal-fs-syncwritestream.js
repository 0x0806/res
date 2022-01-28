'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const filename = path.join(tmpdir.path, 'sync-write-stream.txt');
{
  const stream = new SyncWriteStream(1);
  assert.strictEqual(stream.fd, 1);
  assert.strictEqual(stream.readable, false);
  assert.strictEqual(stream.autoClose, true);
}
{
  const stream = new SyncWriteStream(1, { autoClose: false });
  assert.strictEqual(stream.fd, 1);
  assert.strictEqual(stream.readable, false);
  assert.strictEqual(stream.autoClose, false);
}
{
  const fd = fs.openSync(filename, 'w');
  const stream = new SyncWriteStream(fd);
  const chunk = Buffer.from('foo');
  assert.strictEqual(stream._write(chunk, null, common.mustCall(1)), true);
  assert.strictEqual(fs.readFileSync(filename).equals(chunk), true);
  fs.closeSync(fd);
}
{
  const fd = fs.openSync(filename, 'w');
  const stream = new SyncWriteStream(fd);
  stream.on('close', common.mustCall());
  assert.strictEqual(stream.destroy(), stream);
  assert.strictEqual(stream.fd, null);
}
{
  const fd = fs.openSync(filename, 'w');
  const stream = new SyncWriteStream(fd);
  stream.on('close', common.mustCall());
  assert.strictEqual(stream.destroySoon(), stream);
  assert.strictEqual(stream.fd, null);
}
{
  const fd = fs.openSync(filename, 'w');
  const stream = new SyncWriteStream(fd);
  assert.strictEqual(stream.fd, fd);
  stream.end();
  stream.on('close', common.mustCall(() => {
    assert.strictEqual(stream.fd, null);
  }));
}
