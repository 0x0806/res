'use strict';
const assert = require('assert');
[
  'utf-8',
  'unicode-1-1-utf-8',
  'utf8',
  'utf-16be',
  'utf-16le',
  'utf-16',
].forEach((i) => {
  ['\u0000', '\u000b', '\u00a0', '\u2028', '\u2029'].forEach((ws) => {
    assert.throws(
      () => new TextDecoder(`${ws}${i}`),
      {
        code: 'ERR_ENCODING_NOT_SUPPORTED',
        name: 'RangeError'
      }
    );
    assert.throws(
      () => new TextDecoder(`${i}${ws}`),
      {
        code: 'ERR_ENCODING_NOT_SUPPORTED',
        name: 'RangeError'
      }
    );
    assert.throws(
      () => new TextDecoder(`${ws}${i}${ws}`),
      {
        code: 'ERR_ENCODING_NOT_SUPPORTED',
        name: 'RangeError'
      }
    );
  });
});
