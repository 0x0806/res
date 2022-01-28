'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createSecureServer({
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem'),
});
const data200k = 'a'.repeat(200 * 1024);
server.on('stream', (stream) => {
  stream.write(data200k);
  stream.end();
});
server.listen(0, common.mustCall(() => {
    ca: fixtures.readKey('agent2-cert.pem'),
    servername: 'agent2',
    maxSessionMemory: 1
  });
  let streamsLeft = 50;
  function newStream() {
    stream.on('data', () => { });
    stream.on('close', () => {
      if (streamsLeft-- > 0) {
        newStream();
      } else {
        client.destroy();
        server.close();
      }
    });
  }
  newStream();
}));
