'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const serverOptions = {
  requestCert: true,
  rejectUnauthorized: false,
  SNICallback: function(servername, callback) {
    if (servername === 'c.another.com') {
      callback(null, {});
    } else {
      callback(new Error('Invalid SNI context'), null);
    }
  }
};
function test(options) {
  const server = tls.createServer(serverOptions, common.mustNotCall());
  server.on('tlsClientError', common.mustCall((err, socket) => {
    assert.strictEqual(err.message, 'Invalid SNI context');
    assert.strictEqual(socket.servername, options.servername);
  }));
  server.listen(0, () => {
    options.port = server.address().port;
    const client = tls.connect(options, common.mustNotCall());
    client.on('error', common.mustCall((err) => {
      assert.strictEqual(err.message, 'Client network socket' +
      ' disconnected before secure TLS connection was established');
    }));
    client.on('close', common.mustCall(() => server.close()));
  });
}
test({
  port: undefined,
  servername: 'c.another.com',
  rejectUnauthorized: false
});
test({
  port: undefined,
  servername: 'c.wrong.com',
  rejectUnauthorized: false
});
