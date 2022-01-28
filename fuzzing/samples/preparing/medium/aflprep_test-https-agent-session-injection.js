'use strict';
const assert = require('assert');
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem'),
  secureProtocol: 'TLSv1_2_method'
};
const ca = [ fixtures.readKey('ca1-cert.pem') ];
const server = https.createServer(options, function(req, res) {
  res.end('ok');
}).listen(0, common.mustCall(function() {
  const port = this.address().port;
  const req = https.get({
    port,
    ca,
    servername: 'nodejs.org',
  }, common.mustNotCall(() => {}));
  req.on('error', common.mustCall((err) => {
    assert.strictEqual(
      err.message,
        'Host: nodejs.org. is not cert\'s CN: agent1');
    const second = https.get({
      port,
      ca,
      servername: 'nodejs.org',
    }, common.mustNotCall(() => {}));
    second.on('error', common.mustCall((err) => {
      server.close();
      assert.strictEqual(
        err.message,
          'Host: nodejs.org. is not cert\'s CN: agent1');
    }));
  }));
}));
