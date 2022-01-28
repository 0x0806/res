'use strict';
const {
  assert, connect, keys, tls
} = require(fixtures.path('tls-connect'));
const client = keys.ec10;
const server = keys.agent10;
function checkServerIdentity(hostname, cert) {
  assert.strictEqual(hostname, 'localhost');
  assert.strictEqual(cert.subject.CN, 'agent10.example.com');
}
split(client.cert, client);
split(server.cert, server);
function split(file, into) {
  assert.strictEqual(certs.length, 3);
  into.single = certs[1];
  into.subca = certs[2];
}
connect({
  client: {
    key: client.key,
    cert: client.cert,
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    ca: client.ca,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    ca: client.ca,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    maxVersion: 'TLSv1.2',
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    ca: client.ca,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.strictEqual(pair.server.err.code,
                     'ERR_SSL_PEER_DID_NOT_RETURN_A_CERTIFICATE');
  assert.strictEqual(pair.client.err.code, 'ECONNRESET');
  return cleanup();
});
if (tls.DEFAULT_MAX_VERSION === 'TLSv1.3') connect({
  client: {
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    ca: client.ca,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.strictEqual(pair.server.err.code,
                     'ERR_SSL_PEER_DID_NOT_RETURN_A_CERTIFICATE');
  pair.client.conn.once('error', common.mustCall((err) => {
    assert.strictEqual(err.code, 'ERR_SSL_TLSV13_ALERT_CERTIFICATE_REQUIRED');
    cleanup();
  }));
});
connect({
  client: {
    key: client.key,
    cert: client.single,
    ca: [server.ca, server.subca],
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.single,
    ca: [client.ca, client.subca],
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.single,
    ca: server.ca + '\n' + server.subca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.single,
    ca: client.ca + '\n' + client.subca,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.single,
    ca: [server.ca + '\n' + server.subca],
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.single,
    ca: [client.ca + '\n' + client.subca],
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.single,
  },
}, function(err, pair, cleanup) {
  assert.strictEqual(err.code, 'UNABLE_TO_VERIFY_LEAF_SIGNATURE');
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.single,
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    ca: client.ca,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(pair.client.error);
  assert.ifError(pair.server.error);
  assert.strictEqual(err.code, 'ECONNRESET');
  return cleanup();
});
connect({
  client: {
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
  },
}, function(err, pair, cleanup) {
  assert.strictEqual(err.code, 'UNABLE_TO_GET_ISSUER_CERT_LOCALLY');
  return cleanup();
});
connect({
  client: {
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert + '\n' + server.ca,
  },
}, function(err, pair, cleanup) {
  assert.strictEqual(err.code, 'SELF_SIGNED_CERT_IN_CHAIN');
  return cleanup();
});
connect({
  client: {
    checkServerIdentity,
    ca: server.ca,
  },
  server: {
    key: server.key,
    cert: server.cert + '\n' + server.ca,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.single,
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    ca: client.ca,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.strictEqual(err.code, 'ECONNRESET');
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.cert,
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.strictEqual(err.code, 'ECONNRESET');
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.cert,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    ca: client.ca,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.cert,
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.cert,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    ca: client.ca,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
connect({
  client: {
    key: client.key,
    cert: client.cert,
    ca: server.ca,
    checkServerIdentity,
  },
  server: {
    key: server.key,
    cert: server.cert,
    requestCert: true,
  },
}, function(err, pair, cleanup) {
  assert.ifError(err);
  return cleanup();
});
