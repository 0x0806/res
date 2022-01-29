'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const bodyLength = 8192;
const requestCount = 1000;
const server = http2.createServer({ maxSessionMemory });
server.on('stream', (stream) => {
  stream.respond();
  stream.end();
});
server.listen(common.mustCall(() => {
    maxSessionMemory
  });
  function request() {
    return new Promise((resolve, reject) => {
      const stream = client.request({
        ':method': 'POST',
        'content-length': bodyLength
      });
      stream.on('error', reject);
      stream.on('response', resolve);
      stream.end('a'.repeat(bodyLength));
    });
  }
  (async () => {
    for (let i = 0; i < requestCount; i++) {
      await request();
    }
    client.close();
    server.close();
  })().then(common.mustCall());
}));
