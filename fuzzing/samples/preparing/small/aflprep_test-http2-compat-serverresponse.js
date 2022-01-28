'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.listen(0, common.mustCall(function() {
  const port = server.address().port;
  server.once('request', common.mustCall(function(request, response) {
    assert.strictEqual(response.req, request);
    response.req = null;
    response.on('finish', common.mustCall(function() {
      process.nextTick(() => {
        server.close();
      });
    }));
    response.end();
  }));
  const client = h2.connect(url, common.mustCall(function() {
    const headers = {
      ':method': 'GET',
      ':scheme': 'http',
      ':authority': `localhost:${port}`
    };
    const request = client.request(headers);
    request.on('end', common.mustCall(function() {
      client.close();
    }));
    request.end();
    request.resume();
  }));
}));
