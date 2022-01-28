'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const pushExpect = 'This is a server-initiated response';
const servExpect = 'This is a client-initiated response';
const server = h2.createServer((request, response) => {
  assert.strictEqual(response.stream.id % 2, 1);
  response.write(servExpect);
  assert.throws(
    () => response.createPushResponse({
      ':method': 'GET'
    }, undefined),
    {
      code: 'ERR_INVALID_CALLBACK',
      name: 'TypeError',
      message: 'Callback must be a function. Received undefined'
    }
  );
  response.stream.on('close', () => {
    response.createPushResponse({
      ':method': 'GET'
    }, common.mustCall((error) => {
      assert.strictEqual(error.code, 'ERR_HTTP2_INVALID_STREAM');
    }));
  });
  response.createPushResponse({
    ':method': 'GET'
  }, common.mustSucceed((push) => {
    assert.strictEqual(push.stream.id % 2, 0);
    push.end(pushExpect);
    response.end();
  }));
});
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
    const headers = {
      ':method': 'GET',
    };
    let remaining = 2;
    function maybeClose() {
      if (--remaining === 0) {
        client.close();
        server.close();
      }
    }
    const req = client.request(headers);
    client.on('stream', common.mustCall((pushStream, headers) => {
      assert.strictEqual(headers[':method'], 'GET');
      assert.strictEqual(headers[':scheme'], 'http');
      assert.strictEqual(headers[':authority'], `localhost:${port}`);
      let actual = '';
      pushStream.on('push', common.mustCall((headers) => {
        assert.strictEqual(headers[':status'], 200);
        assert(headers.date);
      }));
      pushStream.setEncoding('utf8');
      pushStream.on('data', (chunk) => actual += chunk);
      pushStream.on('end', common.mustCall(() => {
        assert.strictEqual(actual, pushExpect);
        maybeClose();
      }));
    }));
    req.on('response', common.mustCall((headers) => {
      assert.strictEqual(headers[':status'], 200);
      assert(headers.date);
    }));
    let actual = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => actual += chunk);
    req.on('end', common.mustCall(() => {
      assert.strictEqual(actual, servExpect);
      maybeClose();
    }));
  }));
}));
