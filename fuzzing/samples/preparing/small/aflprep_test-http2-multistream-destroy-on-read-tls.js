'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createSecureServer({
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem')
});
const filenames = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
server.on('stream', common.mustCall((stream) => {
  function write() {
    stream.write('a'.repeat(10240));
    stream.once('drain', write);
  }
  write();
}, filenames.length));
server.listen(0, common.mustCall(() => {
    ca: fixtures.readKey('agent2-cert.pem'),
    servername: 'agent2'
  });
  let destroyed = 0;
  for (const entry of filenames) {
    const stream = client.request({
    });
    stream.once('data', common.mustCall(() => {
      stream.destroy();
      if (++destroyed === filenames.length) {
        client.destroy();
        server.close();
      }
    }));
  }
}));
