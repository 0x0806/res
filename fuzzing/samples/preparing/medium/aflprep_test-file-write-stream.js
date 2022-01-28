'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const fn = path.join(tmpdir.path, 'write.txt');
tmpdir.refresh();
const file = fs.createWriteStream(fn, {
  highWaterMark: 10
});
const EXPECTED = '012345678910';
const callbacks = {
  open: -1,
  drain: -2,
  close: -1
};
file
  .on('open', function(fd) {
    console.error('open!');
    callbacks.open++;
    assert.strictEqual(typeof fd, 'number');
  })
  .on('drain', function() {
    console.error('drain!', callbacks.drain);
    callbacks.drain++;
    if (callbacks.drain === -1) {
      assert.strictEqual(fs.readFileSync(fn, 'utf8'), EXPECTED);
      file.write(EXPECTED);
    } else if (callbacks.drain === 0) {
      assert.strictEqual(fs.readFileSync(fn, 'utf8'), EXPECTED + EXPECTED);
      file.end();
    }
  })
  .on('close', function() {
    console.error('close!');
    assert.strictEqual(file.bytesWritten, EXPECTED.length * 2);
    callbacks.close++;
    file.write('should not work anymore', common.expectsError({
      code: 'ERR_STREAM_WRITE_AFTER_END',
      name: 'Error',
      message: 'write after end'
    }));
    file.on('error', common.mustNotCall());
    fs.unlinkSync(fn);
  });
for (let i = 0; i < 11; i++) {
  file.write(`${i}`);
}
process.on('exit', function() {
  for (const k in callbacks) {
    assert.strictEqual(callbacks[k], 0, `${k} count off by ${callbacks[k]}`);
  }
  console.log('ok');
});
