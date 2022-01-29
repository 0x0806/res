'use strict';
const assert = require('assert');
const { fork } = require('child_process');
if (process.argv[2] === 'child') {
} else {
  const NODE_EXTRA_CA_CERTS = fixtures.path('keys', 'ca1-cert.pem');
  fork(
    __filename,
    ['child'],
    { env: { ...process.env, NODE_EXTRA_CA_CERTS } },
  ).on('exit', common.mustCall(function(status) {
    assert.strictEqual(status, 0);
  }));
}
