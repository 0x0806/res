'use strict';
const assert = require('assert');
const zlib = require('zlib');
const zipper = zlib.createGzip({ highWaterMark: 16384 });
const unzipper = zlib.createGunzip();
zipper.pipe(unzipper);
zipper.write('A'.repeat(17000));
zipper.flush();
let received = 0;
unzipper.on('data', common.mustCall((d) => {
  received += d.length;
}, 2));
process.on('exit', () => {
  assert.strictEqual(received, 17000);
});
