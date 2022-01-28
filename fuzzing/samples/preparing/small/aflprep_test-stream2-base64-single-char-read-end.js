'use strict';
const { Readable: R, Writable: W } = require('stream');
const assert = require('assert');
const src = new R({ encoding: 'base64' });
const dst = new W();
let hasRead = false;
const accum = [];
src._read = function(n) {
  if (!hasRead) {
    hasRead = true;
    process.nextTick(function() {
      src.push(Buffer.from('1'));
      src.push(null);
    });
  }
};
dst._write = function(chunk, enc, cb) {
  accum.push(chunk);
  cb();
};
src.on('end', function() {
  assert.strictEqual(String(Buffer.concat(accum)), 'MQ==');
  clearTimeout(timeout);
});
src.pipe(dst);
const timeout = setTimeout(function() {
  assert.fail('timed out waiting for _write');
}, 100);
