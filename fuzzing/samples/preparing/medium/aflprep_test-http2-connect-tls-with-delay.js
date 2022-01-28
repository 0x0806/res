'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const tls = require('tls');
const serverOptions = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = http2.createSecureServer(serverOptions, (req, res) => {
  res.end();
});
server.listen(0, '127.0.0.1', common.mustCall(() => {
  const options = {
    ALPNProtocols: ['h2'],
    host: '127.0.0.1',
    servername: 'localhost',
    port: server.address().port,
    rejectUnauthorized: false
  };
  const socket = tls.connect(options, async () => {
    socket.once('readable', () => {
      const client = http2.connect(
        { ...options, createConnection: () => socket }
      );
      client.once('remoteSettings', common.mustCall(() => {
        const req = client.request({
        });
        req.on('data', () => req.resume());
        req.on('end', common.mustCall(() => {
          client.close();
          req.close();
          server.close();
        }));
        req.end();
      }));
    });
  });
}));
