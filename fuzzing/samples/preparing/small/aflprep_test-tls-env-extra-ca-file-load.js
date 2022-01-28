'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const binding = internalBinding('crypto');
const { fork } = require('child_process');
if (process.argv[2] !== 'child') {
  const NODE_EXTRA_CA_CERTS = fixtures.path('keys', 'ca1-cert.pem');
  const extendsEnv = (obj) => ({ ...process.env, ...obj });
  [
    extendsEnv({ CHILD_USE_EXTRA_CA_CERTS: 'yes', NODE_EXTRA_CA_CERTS }),
    extendsEnv({ CHILD_USE_EXTRA_CA_CERTS: 'no' }),
  ].forEach((processEnv) => {
    fork(__filename, ['child'], { env: processEnv })
    .on('exit', common.mustCall((status) => {
      assert.strictEqual(status, 0);
    }));
  });
} else if (process.env.CHILD_USE_EXTRA_CA_CERTS === 'yes') {
  assert.strictEqual(binding.isExtraRootCertsFileLoaded(), true);
} else {
  assert.strictEqual(binding.isExtraRootCertsFileLoaded(), false);
  tls.createServer({});
  assert.strictEqual(binding.isExtraRootCertsFileLoaded(), false);
}
