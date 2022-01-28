'use strict';
const assert = require('assert');
const zlib = require('zlib');
const nonStringInputs = [
  1,
  true,
  { a: 1 },
  ['a'],
];
const unzips = [
  zlib.Unzip(),
  zlib.Gunzip(),
  zlib.Inflate(),
  zlib.InflateRaw(),
  zlib.BrotliDecompress(),
];
nonStringInputs.forEach(common.mustCall((input) => {
  assert.throws(() => {
    zlib.gunzip(input);
  }, {
    name: 'TypeError',
    code: 'ERR_INVALID_ARG_TYPE'
  });
}, nonStringInputs.length));
unzips.forEach(common.mustCall((uz, i) => {
  uz.on('error', common.mustCall());
  uz.on('end', common.mustNotCall);
  uz.write('this is not valid compressed data.');
}, unzips.length));
