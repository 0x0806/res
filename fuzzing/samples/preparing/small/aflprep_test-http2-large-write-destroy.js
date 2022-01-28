'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const content = Buffer.alloc(60000, 0x44);
const server = http2.createSecureServer({
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
});
server.on('stream', common.mustCall((stream) => {
  stream.respond({
    'Content-Length': (content.length.toString() * 2),
    'Vary': 'Accept-Encoding'
  }, { waitForTrailers: true });
  stream.write(content);
  stream.destroy();
}));
server.listen(0, common.mustCall(() => {
                               { rejectUnauthorized: false });
  req.end();
  req.on('close', common.mustCall(() => {
    client.close();
    server.close();
  }));
}));
