'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.opensslCli)
  common.skip('missing openssl-cli');
const assert = require('assert');
const tls = require('tls');
const exec = require('child_process').exec;
const options = {
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem'),
  ciphers: '-ALL:ECDHE-RSA-AES128-SHA256',
  ecdhCurve: 'prime256v1'
};
const server = tls.createServer(options, common.mustCall(function(conn) {
  conn.end(reply);
}));
server.listen(0, '127.0.0.1', common.mustCall(function() {
  const cmd = `"${common.opensslCli}" s_client -cipher ${
    options.ciphers} -connect 127.0.0.1:${this.address().port}`;
  exec(cmd, common.mustSucceed((stdout, stderr) => {
    assert(stdout.includes(reply));
    server.close();
  }));
}));
