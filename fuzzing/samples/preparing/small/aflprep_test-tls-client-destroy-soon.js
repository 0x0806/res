'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('agent2-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem')
};
const big = Buffer.alloc(2 * 1024 * 1024, 'Y');
const server = tls.createServer(options, common.mustCall(function(socket) {
  socket.end(big);
  socket.destroySoon();
}));
server.listen(0, common.mustCall(function() {
  const client = tls.connect({
    port: this.address().port,
    rejectUnauthorized: false
  }, common.mustCall(function() {
    let bytesRead = 0;
    client.on('readable', function() {
      const d = client.read();
      if (d)
        bytesRead += d.length;
    });
    client.on('end', common.mustCall(function() {
      server.close();
      assert.strictEqual(big.length, bytesRead);
    }));
  }));
}));
