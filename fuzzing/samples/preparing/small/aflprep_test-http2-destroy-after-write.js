'use strict';
if (!common.hasCrypto) {
  common.skip('missing crypto');
}
const http2 = require('http2');
const assert = require('assert');
const server = http2.createServer();
server.on('session', common.mustCall(function(session) {
  session.on('stream', common.mustCall(function(stream) {
    stream.on('end', common.mustCall(function() {
      this.respond({
        ':status': 200
      });
      this.write('foo');
      this.destroy();
    }));
    stream.resume();
  }));
}));
server.listen(0, function() {
  const stream = client.request({ ':method': 'POST' });
  stream.on('response', common.mustCall(function(headers) {
    assert.strictEqual(headers[':status'], 200);
  }));
  stream.on('close', common.mustCall(() => {
    client.close();
    server.close();
  }));
  stream.resume();
  stream.end();
});
