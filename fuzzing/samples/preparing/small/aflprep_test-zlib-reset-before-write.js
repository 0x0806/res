'use strict';
const assert = require('assert');
const zlib = require('zlib');
for (const fn of [
  (z, cb) => {
    z.reset();
    cb();
  },
  (z, cb) => z.params(0, zlib.constants.Z_DEFAULT_STRATEGY, cb),
]) {
  const deflate = zlib.createDeflate();
  const inflate = zlib.createInflate();
  deflate.pipe(inflate);
  const output = [];
  inflate
    .on('error', (err) => {
      assert.ifError(err);
    })
    .on('data', (chunk) => output.push(chunk))
    .on('end', common.mustCall(
      () => assert.deepStrictEqual(Buffer.concat(output).toString(), 'abc')));
  fn(deflate, () => {
    fn(inflate, () => {
      deflate.write('abc');
      deflate.end();
    });
  });
}
