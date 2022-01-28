'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const fs = require('fs');
const tls = require('tls');
function filenamePEM(n) {
  return fixtures.path('keys', `${n}.pem`);
}
function loadPEM(n) {
  return fs.readFileSync(filenamePEM(n));
}
const caCert = loadPEM('ca1-cert');
const opts = {
  host: 'www.nodejs.org',
  port: 443,
  rejectUnauthorized: true
};
tls.connect(opts, common.mustCall(end));
opts.ca = caCert;
tls.connect(opts, fail).on('error', common.mustCall((err) => {
  assert.strictEqual(err.message, 'unable to get local issuer certificate');
}));
function fail() {
  assert.fail('should fail to connect');
}
opts.secureContext = tls.createSecureContext();
tls.connect(opts, common.mustCall(end));
opts.secureContext.context.addCACert(caCert);
tls.connect(opts, common.mustCall(end));
function end() {
  this.end();
}
