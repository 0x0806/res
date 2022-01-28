'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const binding = internalBinding('crypto');
const NativeSecureContext = binding.SecureContext;
binding.SecureContext = function() {
  const rv = new NativeSecureContext();
  rv.setClientCertEngine = undefined;
  return rv;
};
const tls = require('tls');
{
  assert.throws(
    () => { tls.createSecureContext({ clientCertEngine: 'Cannonmouth' }); },
    {
      code: 'ERR_CRYPTO_CUSTOM_ENGINE_NOT_SUPPORTED',
      message: 'Custom engines not supported by this OpenSSL'
    }
  );
}
