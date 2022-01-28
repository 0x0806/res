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
  SNICallback: function(servername, callback) {
    const context = SNIContexts[servername];
    setTimeout(function() {
      if (context) {
        if (context.emptyRegression)
          callback(null, {});
        else
          callback(null, tls.createSecureContext(context));
      } else {
        callback(null, null);
      }
    }, 100);
  }
};
const SNIContexts = {
  'a.example.com': {
    key: loadPEM('agent1-key'),
    cert: loadPEM('agent1-cert'),
    ca: [ loadPEM('ca2-cert') ]
  },
  'b.example.com': {
    key: loadPEM('agent3-key'),
    cert: loadPEM('agent3-cert')
  },
  'c.another.com': {
    emptyRegression: true
  }
};
test({
  port: undefined,
  key: loadPEM('agent1-key'),
  cert: loadPEM('agent1-cert'),
  ca: [loadPEM('ca1-cert')],
  servername: 'a.example.com',
  rejectUnauthorized: false
},
     true,
     { sni: 'a.example.com', authorized: false },
     null,
     null);
test({
  port: undefined,
  key: loadPEM('agent4-key'),
  cert: loadPEM('agent4-cert'),
  ca: [loadPEM('ca1-cert')],
  servername: 'a.example.com',
  rejectUnauthorized: false
},
     true,
     { sni: 'a.example.com', authorized: true },
     null,
     null);
test({
  port: undefined,
  key: loadPEM('agent2-key'),
  cert: loadPEM('agent2-cert'),
  ca: [loadPEM('ca2-cert')],
  servername: 'b.example.com',
  rejectUnauthorized: false
},
     true,
     { sni: 'b.example.com', authorized: false },
     null,
     null);
test({
  port: undefined,
  key: loadPEM('agent3-key'),
  cert: loadPEM('agent3-cert'),
  ca: [loadPEM('ca1-cert')],
  servername: 'c.wrong.com',
  rejectUnauthorized: false
},
     false,
     { sni: 'c.wrong.com', authorized: false },
     null,
     null);
test({
  port: undefined,
  key: loadPEM('agent3-key'),
  cert: loadPEM('agent3-cert'),
  ca: [loadPEM('ca1-cert')],
  servername: 'c.another.com',
  rejectUnauthorized: false
},
     false,
     null,
     'Client network socket disconnected before secure TLS ' +
       'connection was established',
     'Invalid SNI context');
function test(options, clientResult, serverResult, clientError, serverError) {
  const server = tls.createServer(serverOptions, (c) => {
    assert.deepStrictEqual(
      serverResult,
      { sni: c.servername, authorized: c.authorized }
    );
  });
  if (serverResult) {
    assert(!serverError);
    server.on('tlsClientError', common.mustNotCall());
  } else {
    assert(serverError);
    server.on('tlsClientError', common.mustCall((err) => {
      assert.strictEqual(err.message, serverError);
    }));
  }
  server.listen(0, () => {
    options.port = server.address().port;
    const client = tls.connect(options, () => {
      const result = client.authorizationError &&
        (client.authorizationError === 'ERR_TLS_CERT_ALTNAME_INVALID');
      assert.strictEqual(result, clientResult);
      client.end();
    });
    client.on('close', common.mustCall(() => server.close()));
    if (clientError)
      client.on('error', common.mustCall((err) => {
        assert.strictEqual(err.message, clientError);
      }));
    else
      client.on('error', common.mustNotCall());
  });
}
