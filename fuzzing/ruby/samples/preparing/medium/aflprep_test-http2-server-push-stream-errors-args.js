'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', common.mustCall((stream, headers) => {
  const port = server.address().port;
  assert.throws(
    () => stream.pushStream({
      ':scheme': 'http',
      ':authority': `localhost:${port}`,
    }, {}, 'callback'),
    {
      code: 'ERR_INVALID_CALLBACK',
      message: "Callback must be a function. Received 'callback'"
    }
  );
  assert.throws(
    () => stream.pushStream({ 'connection': 'test' }, {}, () => {}),
    {
      code: 'ERR_HTTP2_INVALID_CONNECTION_HEADERS',
      name: 'TypeError',
    }
  );
  stream.end('test');
}));
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  const req = client.request(headers);
  req.setEncoding('utf8');
  let data = '';
  req.on('data', common.mustCall((d) => data += d));
  req.on('end', common.mustCall(() => {
    assert.strictEqual(data, 'test');
    server.close();
    client.close();
  }));
  req.end();
}));
