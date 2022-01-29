'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
const singles = [
  'content-type',
  'user-agent',
  'referer',
  'authorization',
  'proxy-authorization',
  'if-modified-since',
  'if-unmodified-since',
  'from',
  'location',
  'max-forwards',
];
server.on('stream', common.mustNotCall());
server.listen(0, common.mustCall(() => {
  singles.forEach((i) => {
    assert.throws(
      () => client.request({ [i]: 'abc', [i.toUpperCase()]: 'xyz' }),
      {
        code: 'ERR_HTTP2_HEADER_SINGLE_VALUE',
        name: 'TypeError',
        message: `Header field "${i}" must only have a single value`
      }
    );
    assert.throws(
      () => client.request({ [i]: ['abc', 'xyz'] }),
      {
        code: 'ERR_HTTP2_HEADER_SINGLE_VALUE',
        name: 'TypeError',
        message: `Header field "${i}" must only have a single value`
      }
    );
  });
  server.close();
  client.close();
}));
