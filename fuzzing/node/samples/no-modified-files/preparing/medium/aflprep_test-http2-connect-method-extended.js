'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
server.on('stream', common.mustCall((stream, headers) => {
  assert.strictEqual(headers[':method'], 'CONNECT');
  assert.strictEqual(headers[':scheme'], 'http');
  assert.strictEqual(headers[':protocol'], 'foo');
  assert.strictEqual(headers[':authority'],
                     `localhost:${server.address().port}`);
  stream.respond();
  stream.end('ok');
}));
server.listen(0, common.mustCall(() => {
  client.on('remoteSettings', common.mustCall((settings) => {
    assert(settings.enableConnectProtocol);
    const req = client.request({
      ':method': 'CONNECT',
      ':protocol': 'foo'
    });
    req.resume();
    req.on('end', common.mustCall());
    req.on('close', common.mustCall(() => {
      assert.strictEqual(req.rstCode, 0);
      server.close();
      client.close();
    }));
    req.end();
  }));
}));
