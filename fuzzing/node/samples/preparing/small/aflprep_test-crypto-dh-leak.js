'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (process.config.variables.asan)
  common.skip('ASAN messes with memory measurements');
const assert = require('assert');
const crypto = require('crypto');
const before = process.memoryUsage.rss();
{
  const size = common.hasFipsCrypto || common.hasOpenSSL3 ? 1024 : 256;
  const dh = crypto.createDiffieHellman(size);
  const publicKey = dh.generateKeys();
  const privateKey = dh.getPrivateKey();
  for (let i = 0; i < 5e4; i += 1) {
    dh.setPublicKey(publicKey);
    dh.setPrivateKey(privateKey);
  }
}
global.gc();
const after = process.memoryUsage.rss();
assert(after - before < 10 << 20, `before=${before} after=${after}`);
