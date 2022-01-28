'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = tls.createServer(options, function(s) {
  s.end('hello');
}).listen(0, function() {
  const opts = {
    port: this.address().port,
    rejectUnauthorized: false
  };
  const client = tls.connect(opts, function() {
    putImmediate(client);
  });
  client.resume();
});
function putImmediate(client) {
  setImmediate(function() {
    if (client.ssl) {
      const fd = client.ssl.fd;
      assert(!!fd);
      putImmediate(client);
    } else {
      server.close();
    }
  });
}
