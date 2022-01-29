'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = { key: fixtures.readKey('rsa_private.pem'),
                  cert: fixtures.readKey('rsa_cert.crt'),
                  ca: [ fixtures.readKey('rsa_ca.crt') ] };
const writes = [
  'some server data',
  'and a separate packet',
  'and one more',
];
let receivedWrites = 0;
const server = tls.createServer(options, function(c) {
  c.resume();
  writes.forEach(function(str) {
    c.write(str);
  });
}).listen(0, common.mustCall(function() {
  const connectOpts = { rejectUnauthorized: false };
  const c = tls.connect(this.address().port, connectOpts, function() {
    c.write('some client data');
    c.on('readable', function() {
      let data = c.read();
      if (data === null)
        return;
      data = data.toString();
      while (data.length !== 0) {
        assert(data.startsWith(writes[receivedWrites]));
        data = data.slice(writes[receivedWrites].length);
        if (++receivedWrites === writes.length) {
          c.end();
          server.close();
        }
      }
    });
  });
}));
process.on('exit', function() {
  assert.strictEqual(receivedWrites, writes.length);
});
