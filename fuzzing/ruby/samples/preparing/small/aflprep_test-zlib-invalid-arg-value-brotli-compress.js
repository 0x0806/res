'use strict';
const assert = require('assert');
const { BrotliCompress, constants } = require('zlib');
const opts = {
  params: {
    [constants.BROTLI_PARAM_MODE]: 'lol'
  }
};
assert.throws(() => BrotliCompress(opts), {
  code: 'ERR_INVALID_ARG_TYPE'
});
