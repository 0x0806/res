'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { subtle } = require('crypto').webcrypto;
async function testVerify({ algorithm,
                            hash,
                            publicKeyBuffer,
                            privateKeyBuffer,
                            signature,
                            plaintext }) {
  const [
    publicKey,
    noVerifyPublicKey,
    privateKey,
    hmacKey,
    wrongKeys,
  ] = await Promise.all([
    subtle.importKey(
      'spki',
      publicKeyBuffer,
      { name: algorithm.name, hash },
      false,
      ['verify']),
    subtle.importKey(
      'spki',
      publicKeyBuffer,
      { name: algorithm.name, hash },
      false,
    subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name: algorithm.name, hash },
      false,
      ['sign']),
    subtle.generateKey(
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']),
    subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-521',
        hash: 'SHA-256',
      },
      false,
      ['sign']),
  ]);
  assert(await subtle.verify(algorithm, publicKey, signature, plaintext));
  const copy = Buffer.from(plaintext);
  const sigcopy = Buffer.from(signature);
  const p = subtle.verify(algorithm, publicKey, sigcopy, copy);
  copy[0] = 255 - copy[0];
  sigcopy[0] = 255 - sigcopy[0];
  assert(await p);
  await assert.rejects(
    subtle.verify(algorithm, privateKey, signature, plaintext), {
    });
  await assert.rejects(
    subtle.verify(algorithm, noVerifyPublicKey, signature, plaintext), {
    });
  await assert.rejects(
    subtle.verify(algorithm, hmacKey, signature, plaintext), {
    });
  await assert.rejects(
    subtle.verify(algorithm, wrongKeys.publicKey, signature, plaintext), {
    });
  {
    const copy = Buffer.from(signature);
    copy[0] = 255 - copy[0];
    assert(!(await subtle.verify(algorithm, publicKey, copy, plaintext)));
    assert(!(await subtle.verify(
      algorithm,
      publicKey,
      copy.slice(1),
      plaintext)));
  }
  {
    const copy = Buffer.from(plaintext);
    copy[0] = 255 - copy[0];
    assert(!(await subtle.verify(algorithm, publicKey, signature, copy)));
  }
  {
    const otherhash = hash === 'SHA-1' ? 'SHA-256' : 'SHA-1';
    assert(!(await subtle.verify({
      ...algorithm,
      hash: otherhash
    }, publicKey, signature, copy)));
  }
  await assert.rejects(
    subtle.verify(
      { ...algorithm, hash: 'sha256' },
      publicKey,
      signature,
      copy),
}
async function testSign({
  algorithm,
  hash,
  publicKeyBuffer,
  privateKeyBuffer,
  signature,
  plaintext,
}) {
  const [
    publicKey,
    noSignPrivateKey,
    privateKey,
    hmacKey,
    wrongKeys,
  ] = await Promise.all([
    subtle.importKey(
      'spki',
      publicKeyBuffer,
      { name: algorithm.name, hash },
      false,
      ['verify']),
    subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name: algorithm.name, hash },
      false,
    subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name: algorithm.name, hash },
      false,
      ['sign']),
    subtle.generateKey(
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']),
    subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-521',
        hash: 'SHA-256',
      },
      false,
      ['sign']),
  ]);
  {
    const sig = await subtle.sign(algorithm, privateKey, plaintext);
    assert(await subtle.verify(algorithm, publicKey, sig, plaintext));
  }
  {
    const copy = Buffer.from(plaintext);
    const p = subtle.sign(algorithm, privateKey, copy);
    copy[0] = 255 - copy[0];
    const sig = await p;
    assert(await subtle.verify(algorithm, publicKey, sig, plaintext));
  }
  await assert.rejects(
    subtle.sign(algorithm, publicKey, plaintext), {
    });
  await assert.rejects(
    subtle.sign(algorithm, noSignPrivateKey, plaintext), {
    });
  await assert.rejects(
    subtle.sign(algorithm, hmacKey, plaintext), {
    });
  await assert.rejects(
    subtle.sign(algorithm, wrongKeys.privateKey, plaintext), {
    });
}
(async function() {
  const variations = [];
  dsa().forEach((vector) => {
    variations.push(testVerify(vector));
    variations.push(testSign(vector));
  });
  await Promise.all(variations);
})().then(common.mustCall());
