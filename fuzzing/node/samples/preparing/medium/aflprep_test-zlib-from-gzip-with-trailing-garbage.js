'use strict';
const assert = require('assert');
const zlib = require('zlib');
let data = Buffer.concat([
  zlib.gzipSync('abc'),
  zlib.gzipSync('def'),
  Buffer.alloc(10),
]);
assert.strictEqual(zlib.gunzipSync(data).toString(), 'abcdef');
zlib.gunzip(data, common.mustSucceed((result) => {
  assert.strictEqual(
    result.toString(),
    'abcdef',
    `result '${result.toString()}' should match original string`
  );
}));
data = Buffer.concat([
  zlib.gzipSync('abc'),
  zlib.gzipSync('def'),
  Buffer.from([0x1f, 0x8b, 0xff, 0xff]),
  Buffer.alloc(10),
]);
assert.throws(
  () => zlib.gunzipSync(data),
);
zlib.gunzip(data, common.mustCall((err, result) => {
  common.expectsError({
    code: 'Z_DATA_ERROR',
    name: 'Error',
    message: 'unknown compression method'
  })(err);
  assert.strictEqual(result, undefined);
}));
data = Buffer.concat([
  zlib.gzipSync('abc'),
  zlib.gzipSync('def'),
  Buffer.from([0x1f, 0x8b, 0xff, 0xff]),
]);
assert.throws(
  () => zlib.gunzipSync(data),
);
zlib.gunzip(data, common.mustCall((err, result) => {
  assert(err instanceof Error);
  assert.strictEqual(err.code, 'Z_DATA_ERROR');
  assert.strictEqual(err.message, 'unknown compression method');
  assert.strictEqual(result, undefined);
}));
