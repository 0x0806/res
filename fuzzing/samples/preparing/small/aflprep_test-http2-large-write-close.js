'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const content = Buffer.alloc(1e5, 0x44);
const server = http2.createSecureServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
});
server.on('stream', common.mustCall((stream) => {
  stream.respond({
    'Content-Length': (content.length.toString() * 2),
    'Vary': 'Accept-Encoding'
  });
  stream.write(content);
  stream.write(content);
  stream.end();
  stream.close();
}));
server.listen(0, common.mustCall(() => {
                               { rejectUnauthorized: false });
  req.end();
  let receivedBufferLength = 0;
  req.on('data', common.mustCallAtLeast((buf) => {
    receivedBufferLength += buf.length;
  }, 1));
  req.on('close', common.mustCall(() => {
    assert.strictEqual(receivedBufferLength, content.length * 2);
    client.close();
    server.close();
  }));
}));
