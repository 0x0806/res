'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', (stream, headers) => {
  assert.deepStrictEqual(headers, {
    ':scheme': 'http',
    ':authority': `localhost:${server.address().port}`,
    ':method': 'GET',
    'bar': '',
    '__proto__': null,
    [http2.sensitiveHeaders]: []
  });
  stream.session.destroy();
  server.close();
});
server.listen(0, common.mustCall(() => {
}));
