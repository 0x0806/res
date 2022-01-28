'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const tls = require('tls');
const options = {
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem')
};
const server = https.createServer(options, common.mustCall((req, res) => {
  res.end('Goodbye');
}, 2));
server.listen(0, common.mustCall(function() {
  const client1 = tls.connect({
    port: this.address().port,
    rejectUnauthorized: false
  }, common.mustCall(() => {
    console.log('connect1');
    assert.strictEqual(client1.isSessionReused(), false);
                  'Server: 127.0.0.1\r\n' +
                  '\r\n');
  }));
  client1.once('session', common.mustCall((session) => {
    console.log('session');
    const opts = {
      port: server.address().port,
      rejectUnauthorized: false,
      session,
    };
    const client2 = tls.connect(opts, common.mustCall(() => {
      console.log('connect2');
      assert.strictEqual(client2.isSessionReused(), true);
                    'Server: 127.0.0.1\r\n' +
                    '\r\n');
    }));
    client2.on('close', () => {
      console.log('close2');
      server.close();
    });
    client2.resume();
  }));
  client1.resume();
}));
