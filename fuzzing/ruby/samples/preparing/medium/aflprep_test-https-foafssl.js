'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.opensslCli)
  common.skip('node compiled without OpenSSL CLI.');
const assert = require('assert');
const https = require('https');
const spawn = require('child_process').spawn;
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt'),
  requestCert: true,
  rejectUnauthorized: false
};
const CRLF = '\r\n';
const body = 'hello world\n';
let cert;
const server = https.createServer(options, common.mustCall(function(req, res) {
  console.log('got request');
  cert = req.connection.getPeerCertificate();
  assert.strictEqual(cert.subjectaltname, webIdUrl);
  assert.strictEqual(cert.exponent, exponent);
  assert.strictEqual(cert.modulus, modulus);
  res.end(body, () => { console.log('stream finished'); });
  console.log('sent response');
}));
server.listen(0, function() {
  const args = ['s_client',
                '-quiet',
                '-connect', `127.0.0.1:${this.address().port}`,
  const client = spawn(common.opensslCli, args);
  client.stdout.on('data', function(data) {
    console.log('response received');
    const message = data.toString();
    const contents = message.split(CRLF + CRLF).pop();
    assert.strictEqual(body, contents);
    server.close((e) => {
      assert.ifError(e);
      console.log('server closed');
    });
    console.log('server.close() called');
  });
  client.on('error', function(error) {
    throw error;
  });
});
