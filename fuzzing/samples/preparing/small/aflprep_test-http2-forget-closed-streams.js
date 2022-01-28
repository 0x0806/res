'use strict';
if (!common.hasCrypto) {
  common.skip('missing crypto');
}
const http2 = require('http2');
const assert = require('assert');
const server = http2.createServer({ maxSessionMemory: 1 });
server.on('session', function(session) {
  session.on('stream', function(stream) {
    stream.on('end', common.mustCall(function() {
      this.respond({
        ':status': 200
      }, {
        endStream: true
      });
    }));
    stream.resume();
  });
});
server.listen(0, function() {
  function next(i) {
    if (i === 10000) {
      client.close();
      return server.close();
    }
    const stream = client.request({ ':method': 'POST' });
    stream.on('response', common.mustCall(function(headers) {
      assert.strictEqual(headers[':status'], 200);
      this.on('close', common.mustCall(() => next(i + 1)));
    }));
    stream.end();
  }
  next(0);
});
