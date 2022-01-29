'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const tls = require('tls');
const cert = fixtures.readKey('rsa_cert.crt');
const key = fixtures.readKey('rsa_private.pem');
const conn = tls.connect({ cert, key, port: 0 }, common.mustNotCall());
conn.on('error', function() {});
conn.destroy();
