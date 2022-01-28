'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const unsupportedWarned = common.mustCall(1);
process.on('warning', ({ name, message }) => {
  const expectedMessage =
  if (name === 'UnsupportedWarning' && message === expectedMessage)
    unsupportedWarned();
});
const server = h2.createServer();
server.listen(0, common.mustCall(function() {
  const port = server.address().port;
  server.once('request', common.mustCall(function(request, response) {
    response.on('finish', common.mustCall(function() {
      assert.strictEqual(response.statusMessage, '');
      server.close();
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
    request.on('response', common.mustCall(function(headers) {
      assert.strictEqual(headers[':status'], 200);
    }, 1));
    request.on('end', common.mustCall(function() {
      client.close();
    }));
    request.end();
    request.resume();
  }));
}));
