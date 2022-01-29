'use strict';
if (!common.hasCrypto) common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
assert(Array.isArray(tls.rootCertificates));
assert(tls.rootCertificates.length > 0);
assert.strictEqual(tls.rootCertificates, tls.rootCertificates);
assert.strictEqual(tls.rootCertificates.length,
                   new Set(tls.rootCertificates).size);
assert(tls.rootCertificates.every((s) => {
  return s.startsWith('-----BEGIN CERTIFICATE-----\n');
}));
assert(tls.rootCertificates.every((s) => {
  return s.endsWith('\n-----END CERTIFICATE-----');
}));
