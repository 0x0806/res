'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const server = http2.createServer();
server.on('session', common.mustCall((session) => {
  session.on('remoteSettings', common.mustCall((settings) => {
    assert.strictEqual(settings.enablePush, false);
  }));
}));
server.on('stream', common.mustCall((stream) => {
  assert.strictEqual(stream.pushAllowed, false);
  assert.throws(() => {
    stream.pushStream({
      ':scheme': 'http',
      ':authority': `localhost:${server.address().port}`,
    }, common.mustNotCall());
  }, {
    code: 'ERR_HTTP2_PUSH_DISABLED',
    name: 'Error'
  });
  stream.respond({ ':status': 200 });
  stream.end('test');
}));
server.listen(0, common.mustCall(() => {
  const options = { settings: { enablePush: false } };
                               options);
  client.on('stream', common.mustNotCall());
  req.resume();
  req.on('end', common.mustCall(() => {
    server.close();
    client.close();
  }));
  req.end();
}));
