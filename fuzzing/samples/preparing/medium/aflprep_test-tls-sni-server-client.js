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
  cert: loadPEM('agent2-cert')
};
const SNIContexts = {
  'a.example.com': {
    key: loadPEM('agent1-key'),
    cert: loadPEM('agent1-cert')
  },
  'asterisk.test.com': {
    key: loadPEM('agent3-key'),
    cert: loadPEM('agent3-cert')
  },
  'chain.example.com': {
    key: loadPEM('agent6-key'),
    cert: loadPEM('agent6-cert')
  }
};
test(
  {
    ca: [loadPEM('ca1-cert')],
    servername: 'a.example.com'
  },
  true,
  'a.example.com'
);
test(
  {
    ca: [loadPEM('ca2-cert')],
    servername: 'b.test.com',
  },
  true,
  'b.test.com'
);
test(
  {
    ca: [loadPEM('ca2-cert')],
    servername: 'a.b.test.com',
  },
  false,
  'a.b.test.com'
);
test(
  {
    ca: [loadPEM('ca1-cert')],
    servername: 'c.wrong.com',
  },
  false,
  'c.wrong.com'
);
test(
  {
    ca: [loadPEM('ca1-cert')],
    servername: 'chain.example.com',
  },
  true,
  'chain.example.com'
);
function test(options, clientResult, serverResult) {
  const server = tls.createServer(serverOptions, (c) => {
    assert.strictEqual(c.servername, serverResult);
    assert.strictEqual(c.authorized, false);
  });
  server.addContext('a.example.com', SNIContexts['a.example.com']);
  server.addContext('*.test.com', SNIContexts['asterisk.test.com']);
  server.addContext('chain.example.com', SNIContexts['chain.example.com']);
  server.on('tlsClientError', common.mustNotCall());
  server.listen(0, () => {
    const client = tls.connect({
      ...options,
      port: server.address().port,
      rejectUnauthorized: false
    }, () => {
      const result = client.authorizationError &&
        (client.authorizationError === 'ERR_TLS_CERT_ALTNAME_INVALID');
      assert.strictEqual(result, clientResult);
      client.end();
    });
    client.on('close', common.mustCall(() => {
      server.close();
    }));
  });
}
