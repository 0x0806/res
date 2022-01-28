'use strict';
const child_process = require('child_process');
const assert = require('assert');
const fs = require('fs');
const fn = fixtures.path('elipses.txt');
const rangeFile = fixtures.path('x.txt');
function test1(options) {
  let paused = false;
  let bytesRead = 0;
  const file = fs.createReadStream(fn, options);
  const fileSize = fs.statSync(fn).size;
  assert.strictEqual(file.bytesRead, 0);
  file.on('open', common.mustCall(function(fd) {
    file.length = 0;
    assert.strictEqual(typeof fd, 'number');
    assert.strictEqual(file.bytesRead, 0);
    assert.ok(file.readable);
    file.pause();
    file.resume();
    file.pause();
    file.resume();
  }));
  file.on('data', function(data) {
    assert.ok(data instanceof Buffer);
    assert.ok(data.byteOffset % 8 === 0);
    assert.ok(!paused);
    file.length += data.length;
    bytesRead += data.length;
    assert.strictEqual(file.bytesRead, bytesRead);
    paused = true;
    file.pause();
    setTimeout(function() {
      paused = false;
      file.resume();
    }, 10);
  });
  file.on('end', common.mustCall(function(chunk) {
    assert.strictEqual(bytesRead, fileSize);
    assert.strictEqual(file.bytesRead, fileSize);
  }));
  file.on('close', common.mustCall(function() {
    assert.strictEqual(bytesRead, fileSize);
    assert.strictEqual(file.bytesRead, fileSize);
  }));
  process.on('exit', function() {
    assert.strictEqual(file.length, 30000);
  });
}
test1({});
test1({
  fs: {
    open: common.mustCall(fs.open),
    read: common.mustCallAtLeast(fs.read, 1),
    close: common.mustCall(fs.close),
  }
});
{
  const file = fs.createReadStream(fn, { encoding: 'utf8' });
  file.length = 0;
  file.on('data', function(data) {
    assert.strictEqual(typeof data, 'string');
    file.length += data.length;
    for (let i = 0; i < data.length; i++) {
      assert.strictEqual(data[i], '\u2026');
    }
  });
  file.on('close', common.mustCall());
  process.on('exit', function() {
    assert.strictEqual(file.length, 10000);
  });
}
{
  const file =
    fs.createReadStream(rangeFile, { bufferSize: 1, start: 1, end: 2 });
  let contentRead = '';
  file.on('data', function(data) {
    contentRead += data.toString('utf-8');
  });
  file.on('end', common.mustCall(function(data) {
    assert.strictEqual(contentRead, 'yz');
  }));
}
{
  const file = fs.createReadStream(rangeFile, { bufferSize: 1, start: 1 });
  file.data = '';
  file.on('data', function(data) {
    file.data += data.toString('utf-8');
  });
  file.on('end', common.mustCall(function() {
    assert.strictEqual(file.data, 'yz\n');
  }));
}
{
  const file = fs.createReadStream(rangeFile, { bufferSize: 1.23, start: 1 });
  file.data = '';
  file.on('data', function(data) {
    file.data += data.toString('utf-8');
  });
  file.on('end', common.mustCall(function() {
    assert.strictEqual(file.data, 'yz\n');
  }));
}
assert.throws(
  () => {
    fs.createReadStream(rangeFile, { start: 10, end: 2 });
  },
  {
    code: 'ERR_OUT_OF_RANGE',
    message: 'The value of "start" is out of range. It must be <= "end"' +
             ' (here: 2). Received 10',
    name: 'RangeError'
  });
{
  const stream = fs.createReadStream(rangeFile, { start: 0, end: 0 });
  stream.data = '';
  stream.on('data', function(chunk) {
    stream.data += chunk;
  });
  stream.on('end', common.mustCall(function() {
    assert.strictEqual(stream.data, 'x');
  }));
}
{
  const stream = new fs.createReadStream(rangeFile, { end: 1 });
  stream.data = '';
  stream.on('data', function(chunk) {
    stream.data += chunk;
  });
  stream.on('end', common.mustCall(function() {
    assert.strictEqual(stream.data, 'xy');
  }));
}
if (!common.isWindows) {
  tmpdir.refresh();
  const mkfifoResult = child_process.spawnSync('mkfifo', [filename]);
  if (!mkfifoResult.error) {
    child_process.exec(`echo "xyz foobar" > '${filename}'`);
    const stream = new fs.createReadStream(filename, { end: 1 });
    stream.data = '';
    stream.on('data', function(chunk) {
      stream.data += chunk;
    });
    stream.on('end', common.mustCall(function() {
      assert.strictEqual(stream.data, 'xy');
      fs.unlinkSync(filename);
    }));
  } else {
    common.printSkipMessage('mkfifo not available');
  }
}
{
  const pauseRes = fs.createReadStream(rangeFile);
  pauseRes.pause();
  pauseRes.resume();
}
{
  let file = fs.createReadStream(rangeFile, { autoClose: false });
  let data = '';
  file.on('data', function(chunk) { data += chunk; });
  file.on('end', common.mustCall(function() {
    assert.strictEqual(data, 'xyz\n');
    process.nextTick(function() {
      assert(!file.closed);
      assert(!file.destroyed);
      fileNext();
    });
  }));
  function fileNext() {
    file = fs.createReadStream(null, { fd: file.fd, start: 0 });
    file.data = '';
    file.on('data', function(data) {
      file.data += data;
    });
    file.on('end', common.mustCall(function(err) {
      assert.strictEqual(file.data, 'xyz\n');
    }));
    process.on('exit', function() {
      assert(file.closed);
      assert(file.destroyed);
    });
  }
}
{
  const file = fs.createReadStream(null, { fd: 13337, autoClose: false });
  file.on('data', common.mustNotCall());
  file.on('error', common.mustCall());
  process.on('exit', function() {
    assert(!file.closed);
    assert(!file.destroyed);
    assert(file.fd);
  });
}
{
  file.on('data', common.mustNotCall());
  file.on('error', common.mustCall());
  process.on('exit', function() {
    assert(!file.closed);
    assert(file.destroyed);
  });
}
