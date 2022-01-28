'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.listen(0, common.mustCall(function() {
  const port = server.address().port;
  server.once('request', common.mustCall(function(request, response) {
    assert.strictEqual(request.complete, false);
    request.on('data', () => {});
    request.on('end', common.mustCall(() => {
      assert.strictEqual(request.complete, true);
      response.on('finish', common.mustCall(function() {
        assert.strictEqual(request.socket.readable, request.stream.readable);
        assert.strictEqual(request.socket.readable, false);
        server.close();
      }));
      assert.strictEqual(response.end(), response);
    }));
  }));
  const client = h2.connect(url, common.mustCall(() => {
    const request = client.request();
    request.resume();
    request.on('end', common.mustCall(() => {
      client.close();
    }));
  }));
}));
