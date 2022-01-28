'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
class MyServerRequest extends h2.Http2ServerRequest {
  getUserAgent() {
    return this.headers['user-agent'] || 'unknown';
  }
}
const server = h2.createServer({
  Http2ServerRequest: MyServerRequest
}, (req, res) => {
  assert.strictEqual(req.getUserAgent(), 'node-test');
  res.end();
});
server.listen(0);
server.on('listening', common.mustCall(() => {
  const req = client.request({
    'User-Agent': 'node-test'
  });
  req.on('response', common.mustCall());
  req.resume();
  req.on('end', common.mustCall(() => {
    server.close();
    client.destroy();
  }));
}));
