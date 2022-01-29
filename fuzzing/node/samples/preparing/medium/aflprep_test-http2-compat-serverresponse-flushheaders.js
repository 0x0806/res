'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
let serverResponse;
const server = h2.createServer();
server.listen(0, common.mustCall(function() {
  const port = server.address().port;
  server.once('request', common.mustCall(function(request, response) {
    assert.strictEqual(response.headersSent, false);
    response.flushHeaders();
    assert.strictEqual(response.headersSent, true);
    assert.strictEqual(response._header, true);
    assert.throws(() => {
      response.writeHead(400, { 'foo-bar': 'abc123' });
    }, {
      code: 'ERR_HTTP2_HEADERS_SENT'
    });
    response.on('finish', common.mustCall(function() {
      server.close();
      process.nextTick(() => {
      });
    }));
    serverResponse = response;
  }));
  const client = h2.connect(url, common.mustCall(function() {
    const headers = {
      ':method': 'GET',
      ':scheme': 'http',
      ':authority': `localhost:${port}`
    };
    const request = client.request(headers);
    request.on('response', common.mustCall(function(headers, flags) {
      assert.strictEqual(headers['foo-bar'], undefined);
      assert.strictEqual(headers[':status'], 200);
      serverResponse.end();
    }, 1));
    request.on('end', common.mustCall(function() {
      client.close();
    }));
    request.end();
    request.resume();
  }));
}));
