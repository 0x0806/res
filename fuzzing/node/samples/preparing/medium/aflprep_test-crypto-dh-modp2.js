'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const modp2 = crypto.createDiffieHellmanGroup('modp2');
{
  const exmodp2 = crypto.createDiffieHellman(modp2buf, Buffer.from([2]));
  modp2.generateKeys();
  exmodp2.generateKeys();
  const modp2Secret = modp2.computeSecret(exmodp2.getPublicKey())
      .toString('hex');
  const exmodp2Secret = exmodp2.computeSecret(modp2.getPublicKey())
      .toString('hex');
  assert.strictEqual(modp2Secret, exmodp2Secret);
}
{
  const exmodp2 = crypto.createDiffieHellman(modp2buf, '\x02');
  exmodp2.generateKeys();
  const modp2Secret = modp2.computeSecret(exmodp2.getPublicKey())
      .toString('hex');
  const exmodp2Secret = exmodp2.computeSecret(modp2.getPublicKey())
      .toString('hex');
  assert.strictEqual(modp2Secret, exmodp2Secret);
}
{
  const exmodp2 = crypto.createDiffieHellman(modp2buf, 2);
  exmodp2.generateKeys();
  const modp2Secret = modp2.computeSecret(exmodp2.getPublicKey())
      .toString('hex');
  const exmodp2Secret = exmodp2.computeSecret(modp2.getPublicKey())
      .toString('hex');
  assert.strictEqual(modp2Secret, exmodp2Secret);
}
