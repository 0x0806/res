'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const errorMessageRegex = common.hasOpenSSL3 ?
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent2-cert.pem')
};
assert.throws(function() {
  tls.createSecureContext(options);
}, errorMessageRegex);
