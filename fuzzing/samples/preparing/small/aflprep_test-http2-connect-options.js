'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.hasMultiLocalhost())
  common.skip('platform-specific test.');
const http2 = require('http2');
const assert = require('assert');
const server = http2.createServer((req, res) => {
  console.log(`Connect from: ${req.connection.remoteAddress}`);
  assert.strictEqual(req.connection.remoteAddress, '127.0.0.2');
  req.on('end', common.mustCall(() => {
    res.end(`You are from: ${req.connection.remoteAddress}`);
  }));
  req.resume();
});
server.listen(0, '127.0.0.1', common.mustCall(() => {
  const options = { localAddress: '127.0.0.2' };
  const client = http2.connect(
    options
  );
  const req = client.request({
  });
  req.on('data', () => req.resume());
  req.on('end', common.mustCall(function() {
    client.close();
    req.close();
    server.close();
  }));
  req.end();
}));
