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
      ':authority': `localhost:${port}`,
      'foo-bar': 'abc123'
    };
    assert.strictEqual(request.path, undefined);
    assert.strictEqual(request.method, expected[':method']);
    assert.strictEqual(request.scheme, expected[':scheme']);
    assert.strictEqual(request.url, expected[':path']);
    assert.strictEqual(request.authority, expected[':authority']);
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
    request.method = 'POST';
    assert.strictEqual(request.method, 'POST');
    assert.throws(
      () => request.method = '   ',
      {
        code: 'ERR_INVALID_ARG_VALUE',
        name: 'TypeError',
        message: "The argument 'method' is invalid. Received '   '"
      }
    );
    assert.throws(
      () => request.method = true,
      {
        code: 'ERR_INVALID_ARG_TYPE',
        name: 'TypeError',
        message: 'The "method" argument must be of type string. ' +
                 'Received type boolean (true)'
      }
    );
    response.on('finish', common.mustCall(function() {
      server.close();
    }));
    response.end();
  }));
  const client = h2.connect(url, common.mustCall(function() {
    const headers = {
      ':method': 'GET',
      ':scheme': 'http',
      ':authority': `localhost:${port}`,
      'foo-bar': 'abc123'
    };
    const request = client.request(headers);
    request.on('end', common.mustCall(function() {
      client.close();
    }));
    request.end();
    request.resume();
  }));
}));
