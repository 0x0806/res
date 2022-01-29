'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const passKey = fixtures.readKey('rsa_private_encrypted.pem');
const rawKey = fixtures.readKey('rsa_private.pem');
const cert = fixtures.readKey('rsa_cert.crt');
assert(Buffer.isBuffer(passKey));
assert(Buffer.isBuffer(cert));
assert.strictEqual(typeof passKey.toString(), 'string');
assert.strictEqual(typeof cert.toString(), 'string');
function onSecureConnect() {
  return common.mustCall(function() { this.end(); });
}
const server = tls.Server({
  key: passKey,
  passphrase: 'password',
  cert: cert,
  ca: [cert],
  requestCert: true,
  rejectUnauthorized: true
});
server.listen(0, common.mustCall(function() {
  tls.connect({
    port: this.address().port,
    key: passKey,
    passphrase: 'password',
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: rawKey,
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: rawKey,
    passphrase: 'ignored',
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [passKey],
    passphrase: 'password',
    cert: [cert],
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [rawKey],
    cert: [cert],
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [rawKey],
    passphrase: 'ignored',
    cert: [cert],
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: passKey.toString(),
    passphrase: 'password',
    cert: cert.toString(),
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: rawKey.toString(),
    cert: cert.toString(),
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: rawKey.toString(),
    passphrase: 'ignored',
    cert: cert.toString(),
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [passKey.toString()],
    passphrase: 'password',
    cert: [cert.toString()],
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [rawKey.toString()],
    cert: [cert.toString()],
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [rawKey.toString()],
    passphrase: 'ignored',
    cert: [cert.toString()],
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: passKey, passphrase: 'password' }],
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: passKey, passphrase: 'password' }],
    passphrase: 'ignored',
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: passKey }],
    passphrase: 'password',
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: passKey.toString(), passphrase: 'password' }],
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: rawKey, passphrase: 'ignored' }],
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: rawKey.toString(), passphrase: 'ignored' }],
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: rawKey }],
    passphrase: 'ignored',
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: rawKey.toString() }],
    passphrase: 'ignored',
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: rawKey }],
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
  tls.connect({
    port: this.address().port,
    key: [{ pem: rawKey.toString() }],
    cert: cert,
    rejectUnauthorized: false
  }, onSecureConnect());
})).unref();
const errMessagePassword = common.hasOpenSSL3 ?
assert.throws(function() {
  tls.connect({
    port: server.address().port,
    key: passKey,
    cert: cert,
    rejectUnauthorized: false
  });
}, errMessagePassword);
assert.throws(function() {
  tls.connect({
    port: server.address().port,
    key: [passKey],
    cert: cert,
    rejectUnauthorized: false
  });
}, errMessagePassword);
assert.throws(function() {
  tls.connect({
    port: server.address().port,
    key: [{ pem: passKey }],
    cert: cert,
    rejectUnauthorized: false
  });
}, errMessagePassword);
assert.throws(function() {
  tls.connect({
    port: server.address().port,
    key: passKey,
    passphrase: 'invalid',
    cert: cert,
    rejectUnauthorized: false
  });
}, errMessageDecrypt);
assert.throws(function() {
  tls.connect({
    port: server.address().port,
    key: [passKey],
    passphrase: 'invalid',
    cert: cert,
    rejectUnauthorized: false
  });
}, errMessageDecrypt);
assert.throws(function() {
  tls.connect({
    port: server.address().port,
    key: [{ pem: passKey }],
    passphrase: 'invalid',
    cert: cert,
    rejectUnauthorized: false
  });
}, errMessageDecrypt);
assert.throws(function() {
  tls.connect({
    port: server.address().port,
    key: [{ pem: passKey, passphrase: 'invalid' }],
    cert: cert,
    rejectUnauthorized: false
  });
}, errMessageDecrypt);
