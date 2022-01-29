'use strict';
const assert = require('assert');
const fs = require('fs');
const { UV_EBADF } = internalBinding('uv');
fs.openSync = function() {
  return 42;
};
fs.closeSync = function(fd) {
  assert.strictEqual(fd, 42);
  close_called++;
};
fs.readSync = function() {
  throw new Error('BAM');
};
fs.writeSync = function() {
  throw new Error('BAM');
};
internalBinding('fs').fstat = function(fd, bigint, _, ctx) {
  ctx.errno = UV_EBADF;
  ctx.syscall = 'fstat';
};
let close_called = 0;
ensureThrows(function() {
  fs.readFileSync('dummy');
}, 'EBADF: bad file descriptor, fstat');
ensureThrows(function() {
  fs.writeFileSync('dummy', 'xxx');
}, 'BAM');
ensureThrows(function() {
  fs.appendFileSync('dummy', 'xxx');
}, 'BAM');
function ensureThrows(cb, message) {
  let got_exception = false;
  close_called = 0;
  try {
    cb();
  } catch (e) {
    assert.strictEqual(e.message, message);
    got_exception = true;
  }
  assert.strictEqual(close_called, 1);
  assert.strictEqual(got_exception, true);
}
