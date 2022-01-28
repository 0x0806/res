'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http = require('http');
const http2 = require('http2');
const server = http.createServer(common.mustNotCall(() => {}))
  .on('clientError', common.mustCall((error, socket) => {
    assert.strictEqual(error.code, 'HPE_PAUSED_H2_UPGRADE');
    assert.strictEqual(error.bytesParsed, 24);
    socket.destroy();
  }));
server.listen(0, common.mustCall(() => {
  const req = client.request();
  req.on('close', common.mustCall());
  req.on('error', common.expectsError({
    code: 'ERR_HTTP2_ERROR',
    constructor: NghttpError,
    message: 'Protocol error'
  }));
  client.on('error', common.expectsError({
    code: 'ERR_HTTP2_ERROR',
    constructor: NghttpError,
    name: 'Error',
    message: 'Protocol error'
  }));
  client.on('close', common.mustCall(() => server.close()));
}));
