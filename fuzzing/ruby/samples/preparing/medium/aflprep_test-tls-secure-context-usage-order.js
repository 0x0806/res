'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
function loadPEM(n) {
  return fixtures.readKey(`${n}.pem`);
}
const serverOptions = {
  key: loadPEM('agent2-key'),
  cert: loadPEM('agent2-cert'),
  requestCert: true,
  rejectUnauthorized: false,
};
const badSecureContext = {
  key: loadPEM('agent1-key'),
  cert: loadPEM('agent1-cert'),
  ca: [ loadPEM('ca2-cert') ]
};
const goodSecureContext = {
  key: loadPEM('agent1-key'),
  cert: loadPEM('agent1-cert'),
  ca: [ loadPEM('ca1-cert') ]
};
const server = tls.createServer(serverOptions, (c) => {
  if ('a.example.com' === c.servername) {
    assert.strictEqual(c.authorized, false);
  }
  if ('b.example.com' === c.servername) {
    assert.strictEqual(c.authorized, true);
  }
});
server.addContext('*.example.com', badSecureContext);
server.listen(0, () => {
  const options = {
    port: server.address().port,
    key: loadPEM('agent1-key'),
    cert: loadPEM('agent1-cert'),
    ca: [loadPEM('ca1-cert')],
    servername: 'a.example.com',
    rejectUnauthorized: false,
  };
  const client = tls.connect(options, () => {
    client.end();
  });
  client.on('close', common.mustCall(() => {
    server.addContext('*.example.com', goodSecureContext);
    options.servername = 'b.example.com';
    const other = tls.connect(options, () => {
      other.end();
    });
    other.on('close', common.mustCall(() => {
      const onemore = tls.connect(options, () => {
        onemore.end();
      });
      onemore.on('close', common.mustCall(() => {
        server.close();
      }));
    }));
  }));
});
