'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', common.mustCall((stream, headers) => {
  const port = server.address().port;
    stream.pushStream({
      ':scheme': 'http',
      ':authority': `localhost:${port}`,
    }, common.mustSucceed((push, headers) => {
      push.respond({
        ':status': 200,
        'x-push-data': 'pushed by server',
      });
      push.end('pushed by server data');
      assert.throws(() => {
        push.pushStream({}, common.mustNotCall());
      }, {
        code: 'ERR_HTTP2_NESTED_PUSH',
        name: 'Error'
      });
      stream.end('test');
    }));
  }
  stream.respond({
    ':status': 200
  });
}));
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  const req = client.request(headers);
  client.on('stream', common.mustCall((stream, headers) => {
    assert.strictEqual(headers[':scheme'], 'http');
    assert.strictEqual(headers[':authority'], `localhost:${port}`);
    stream.on('push', common.mustCall((headers) => {
      assert.strictEqual(headers[':status'], 200);
      assert.strictEqual(headers['x-push-data'], 'pushed by server');
    }));
    stream.on('aborted', common.mustNotCall());
    stream.resume();
  }));
  let data = '';
  req.on('data', common.mustCall((d) => data += d));
  req.on('end', common.mustCall(() => {
    assert.strictEqual(data, 'test');
    server.close();
    client.close();
  }));
  req.end();
}));
