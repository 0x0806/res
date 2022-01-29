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
      ':method': 'HEAD',
      ':authority': `localhost:${port}`,
    }, common.mustCall((err, push, headers) => {
      assert.strictEqual(push._writableState.ended, true);
      push.respond();
      push.on('error', common.expectsError({
        name: 'Error',
        code: 'ERR_STREAM_WRITE_AFTER_END',
        message: 'write after end'
      }));
      assert(!push.write('test'));
      stream.end('test');
    }));
  }
  stream.respond({
    ':status': 200
  });
}));
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  const countdown = new Countdown(2, () => {
    server.close();
    client.close();
  });
  const req = client.request();
  req.setEncoding('utf8');
  client.on('stream', common.mustCall((stream, headers) => {
    assert.strictEqual(headers[':method'], 'HEAD');
    assert.strictEqual(headers[':scheme'], 'http');
    assert.strictEqual(headers[':authority'], `localhost:${port}`);
    stream.on('push', common.mustCall(() => {
      stream.on('data', common.mustNotCall());
      stream.on('end', common.mustCall());
    }));
    stream.on('close', common.mustCall(() => countdown.dec()));
  }));
  let data = '';
  req.on('data', common.mustCall((d) => data += d));
  req.on('end', common.mustCall(() => {
    assert.strictEqual(data, 'test');
  }));
  req.on('close', common.mustCall(() => countdown.dec()));
  req.end();
}));
