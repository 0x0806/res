'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const EventEmitter = require('events');
process.on('warning', common.mustNotCall('A warning was emitted'));
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respond();
  stream.end();
});
server.listen(common.mustCall(() => {
  function request() {
    return new Promise((resolve, reject) => {
      const stream = client.request();
      stream.on('error', reject);
      stream.on('response', resolve);
      stream.end();
    });
  }
  const requests = [];
  for (let i = 0; i < EventEmitter.defaultMaxListeners + 1; i++) {
    requests.push(request());
  }
  Promise.all(requests).then(common.mustCall()).finally(common.mustCall(() => {
    server.close();
    client.close();
  }));
}));
