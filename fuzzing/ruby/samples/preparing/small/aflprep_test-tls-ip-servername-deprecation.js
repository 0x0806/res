'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
common.expectWarning(
  'DeprecationWarning',
  'Setting the TLS ServerName to an IP address is not permitted by ' +
  'RFC 6066. This will be ignored in a future version.',
  'DEP0123'
);
{
  const options = {
    key: fixtures.readKey('agent1-key.pem'),
    cert: fixtures.readKey('agent1-cert.pem')
  };
  const server = tls.createServer(options, function(s) {
    s.end('hello');
  }).listen(0, function() {
    const client = tls.connect({
      port: this.address().port,
      rejectUnauthorized: false,
      servername: '127.0.0.1',
    }, function() {
      client.end();
    });
  });
  server.on('connection', common.mustCall(function(socket) {
    server.close();
  }));
}
