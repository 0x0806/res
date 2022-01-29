'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const writeSize = 3000000;
const minReadSize = 500000;
const serverTimeout = common.platformTimeout(500);
let offsetTimeout = common.platformTimeout(100);
let didReceiveData = false;
const server = http2.createSecureServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
});
server.on('stream', common.mustCall((stream) => {
  const content = Buffer.alloc(writeSize, 0x44);
  stream.respond({
    'Content-Length': content.length.toString(),
    'Vary': 'Accept-Encoding'
  });
  stream.write(content);
  stream.setTimeout(serverTimeout);
  stream.on('timeout', () => {
    assert.ok(!didReceiveData, 'Should not timeout');
  });
  stream.end();
}));
server.setTimeout(serverTimeout);
server.on('timeout', () => {
  assert.ok(!didReceiveData, 'Should not timeout');
});
server.listen(0, common.mustCall(() => {
                               { rejectUnauthorized: false });
  req.end();
  const resume = () => req.resume();
  let receivedBufferLength = 0;
  let firstReceivedAt;
  req.on('data', common.mustCallAtLeast((buf) => {
    if (receivedBufferLength === 0) {
      didReceiveData = false;
      firstReceivedAt = Date.now();
    }
    receivedBufferLength += buf.length;
    if (receivedBufferLength >= minReadSize &&
        receivedBufferLength < writeSize) {
      didReceiveData = true;
      receivedBufferLength = 0;
      req.pause();
      setTimeout(
        resume,
        serverTimeout + offsetTimeout - (Date.now() - firstReceivedAt)
      );
      offsetTimeout = 0;
    }
  }, 1));
  req.on('end', common.mustCall(() => {
    client.close();
    server.close();
  }));
}));
