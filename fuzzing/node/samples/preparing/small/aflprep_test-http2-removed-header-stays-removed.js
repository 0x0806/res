'use strict';
if (!common.hasCrypto) { common.skip('missing crypto'); }
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer(common.mustCall((request, response) => {
  response.setHeader('date', 'snacks o clock');
  response.end();
}));
server.listen(0, common.mustCall(() => {
  const req = session.request();
  req.on('response', (headers, flags) => {
    assert.deepStrictEqual(headers.date, 'snacks o clock');
  });
  req.on('end', () => {
    session.close();
    server.close();
  });
}));
