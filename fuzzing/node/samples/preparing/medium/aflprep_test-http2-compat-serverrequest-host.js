'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.listen(0, common.mustCall(function() {
  const port = server.address().port;
  server.once('request', common.mustCall(function(request, response) {
    const expected = {
      ':method': 'GET',
      ':scheme': 'http',
      'host': `localhost:${port}`
    };
    assert.strictEqual(request.authority, expected.host);
    const headers = request.headers;
    for (const [name, value] of Object.entries(expected)) {
      assert.strictEqual(headers[name], value);
    }
    const rawHeaders = request.rawHeaders;
    for (const [name, value] of Object.entries(expected)) {
      const position = rawHeaders.indexOf(name);
      assert.notStrictEqual(position, -1);
      assert.strictEqual(rawHeaders[position + 1], value);
    }
    assert(!Object.hasOwnProperty.call(headers, ':authority'));
    assert(!Object.hasOwnProperty.call(rawHeaders, ':authority'));
    response.on('finish', common.mustCall(function() {
      server.close();
    }));
    response.end();
  }));
  const client = h2.connect(url, common.mustCall(function() {
    const headers = {
      ':method': 'GET',
      ':scheme': 'http',
      'host': `localhost:${port}`
    };
    const request = client.request(headers);
    request.on('end', common.mustCall(function() {
      client.close();
    }));
    request.end();
    request.resume();
  }));
}));
