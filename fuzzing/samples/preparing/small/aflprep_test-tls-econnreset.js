'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const net = require('net');
const tls = require('tls');
let clientError = null;
const server = tls.createServer({
  cert: fixtures.readKey('agent1-cert.pem'),
  key: fixtures.readKey('agent1-key.pem'),
}, common.mustNotCall()).on('tlsClientError', function(err, conn) {
  assert(!clientError && conn);
  clientError = err;
  server.close();
}).listen(0, function() {
  net.connect(this.address().port, function() {
    this.destroy();
  }).on('error', common.mustNotCall());
});
process.on('exit', function() {
  assert(clientError);
});
