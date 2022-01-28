'use strict';
const assert = require('assert');
const zlib = require('zlib');
const expectStr = 'blah'.repeat(8);
const expectBuf = Buffer.from(expectStr);
const opts = {
  level: 9,
  chunkSize: 1024,
};
const optsInfo = {
  info: true
};
for (const [type, expect] of [
  ['string', expectStr],
  ['Buffer', expectBuf],
  ...common.getBufferSources(expectBuf).map((obj) =>
    [obj[Symbol.toStringTag], obj]
  ),
]) {
  for (const method of [
    ['gzip', 'gunzip', 'Gzip', 'Gunzip'],
    ['gzip', 'unzip', 'Gzip', 'Unzip'],
    ['deflate', 'inflate', 'Deflate', 'Inflate'],
    ['deflateRaw', 'inflateRaw', 'DeflateRaw', 'InflateRaw'],
    ['brotliCompress', 'brotliDecompress',
     'BrotliCompress', 'BrotliDecompress'],
  ]) {
    zlib[method[0]](expect, opts, common.mustCall((err, result) => {
      zlib[method[1]](result, opts, common.mustCall((err, result) => {
        assert.strictEqual(result.toString(), expectStr,
                           `${method[1]} ${type} with options.`);
      }));
    }));
    zlib[method[0]](expect, common.mustCall((err, result) => {
      zlib[method[1]](result, common.mustCall((err, result) => {
        assert.strictEqual(result.toString(), expectStr,
                           `${method[1]} ${type} without options.`);
      }));
    }));
    zlib[method[0]](expect, optsInfo, common.mustCall((err, result) => {
      assert.ok(result.engine instanceof zlib[method[2]],
                `Should get engine ${method[2]} after ${method[0]} ` +
                `${type} with info option.`);
      const compressed = result.buffer;
      zlib[method[1]](compressed, optsInfo, common.mustCall((err, result) => {
        assert.strictEqual(result.buffer.toString(), expectStr,
                           `${method[1]} ${type} with info option.`);
        assert.ok(result.engine instanceof zlib[method[3]],
                  `Should get engine ${method[3]} after ${method[0]} ` +
                  `${type} with info option.`);
      }));
    }));
    {
      const compressed = zlib[`${method[0]}Sync`](expect, opts);
      const decompressed = zlib[`${method[1]}Sync`](compressed, opts);
      assert.strictEqual(decompressed.toString(), expectStr,
                         `${method[1]}Sync ${type} with options.`);
    }
    {
      const compressed = zlib[`${method[0]}Sync`](expect);
      const decompressed = zlib[`${method[1]}Sync`](compressed);
      assert.strictEqual(decompressed.toString(), expectStr,
                         `${method[1]}Sync ${type} without options.`);
    }
    {
      const compressed = zlib[`${method[0]}Sync`](expect, optsInfo);
      assert.ok(compressed.engine instanceof zlib[method[2]],
                `Should get engine ${method[2]} after ${method[0]} ` +
                `${type} with info option.`);
      const decompressed = zlib[`${method[1]}Sync`](compressed.buffer,
                                                    optsInfo);
      assert.strictEqual(decompressed.buffer.toString(), expectStr,
                         `${method[1]}Sync ${type} without options.`);
      assert.ok(decompressed.engine instanceof zlib[method[3]],
                `Should get engine ${method[3]} after ${method[0]} ` +
                `${type} with info option.`);
    }
  }
}
assert.throws(
  () => zlib.gzip('abc'),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "callback" argument must be of type function. ' +
             'Received undefined'
  }
);
