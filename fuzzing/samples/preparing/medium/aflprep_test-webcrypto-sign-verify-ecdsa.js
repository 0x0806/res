'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { subtle } = require('crypto').webcrypto;
async function testVerify({ name,
                            hash,
                            namedCurve,
                            publicKeyBuffer,
                            privateKeyBuffer,
                            signature,
                            plaintext }) {
  const [
    publicKey,
    noVerifyPublicKey,
    privateKey,
    hmacKey,
    rsaKeys,
  ] = await Promise.all([
    subtle.importKey(
      'spki',
      publicKeyBuffer,
      { name, namedCurve },
      false,
      ['verify']),
    subtle.importKey(
      'spki',
      publicKeyBuffer,
      { name, namedCurve },
      false,
    subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name, namedCurve },
      false,
      ['sign']),
    subtle.generateKey(
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']),
    subtle.generateKey(
      {
        name: 'RSA-PSS',
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      false,
      ['sign']),
  ]);
  assert(await subtle.verify({ name, hash }, publicKey, signature, plaintext));
  const copy = Buffer.from(plaintext);
  const sigcopy = Buffer.from(signature);
  const p = subtle.verify({ name, hash }, publicKey, sigcopy, copy);
  copy[0] = 255 - copy[0];
  sigcopy[0] = 255 - sigcopy[0];
  assert(await p);
  await assert.rejects(
    subtle.verify({ name, hash }, privateKey, signature, plaintext), {
    });
  await assert.rejects(
    subtle.verify({ name, hash }, noVerifyPublicKey, signature, plaintext), {
    });
  await assert.rejects(
    subtle.verify({ name, hash }, hmacKey, signature, plaintext), {
    });
  await assert.rejects(
    subtle.verify({ name, hash }, rsaKeys.publicKey, signature, plaintext), {
    });
  {
    const copy = Buffer.from(signature);
    copy[0] = 255 - copy[0];
    assert(!(await subtle.verify(
      { name, hash },
      publicKey,
      copy,
      plaintext)));
    assert(!(await subtle.verify(
      { name, hash },
      publicKey,
      copy.slice(1),
      plaintext)));
  }
  {
    const copy = Buffer.from(plaintext);
    copy[0] = 255 - copy[0];
    assert(!(await subtle.verify({ name, hash }, publicKey, signature, copy)));
  }
  {
    const otherhash = hash === 'SHA-1' ? 'SHA-256' : 'SHA-1';
    assert(!(await subtle.verify({
      name,
      hash: otherhash
    }, publicKey, signature, copy)));
  }
  await assert.rejects(
    subtle.verify({ name, hash: 'sha256' }, publicKey, signature, copy), {
    });
}
async function testSign({ name,
                          hash,
                          namedCurve,
                          publicKeyBuffer,
                          privateKeyBuffer,
                          signature,
                          plaintext }) {
  const [
    publicKey,
    noSignPrivateKey,
    privateKey,
    hmacKey,
    rsaKeys,
  ] = await Promise.all([
    subtle.importKey(
      'spki',
      publicKeyBuffer,
      { name, namedCurve },
      false,
      ['verify']),
    subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name, namedCurve },
      false,
    subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      { name, namedCurve },
      false,
      ['sign']),
    subtle.generateKey(
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']),
    subtle.generateKey(
      {
        name: 'RSA-PSS',
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      false,
      ['sign']),
  ]);
  {
    const sig = await subtle.sign({ name, hash }, privateKey, plaintext);
    assert.strictEqual(sig.byteLength, signature.byteLength);
    assert(await subtle.verify({ name, hash }, publicKey, sig, plaintext));
  }
  {
    const copy = Buffer.from(plaintext);
    const p = subtle.sign({ name, hash }, privateKey, copy);
    copy[0] = 255 - copy[0];
    const sig = await p;
    assert(await subtle.verify({ name, hash }, publicKey, sig, plaintext));
  }
  await assert.rejects(
    subtle.sign({ name, hash }, publicKey, plaintext), {
    });
  await assert.rejects(
    subtle.sign({ name, hash }, noSignPrivateKey, plaintext), {
    });
  await assert.rejects(
    subtle.sign({ name, hash }, hmacKey, plaintext), {
    });
  await assert.rejects(
    subtle.sign({ name, hash }, rsaKeys.privateKey, plaintext), {
    });
}
(async function() {
  const variations = [];
  vectors.forEach((vector) => {
    variations.push(testVerify(vector));
    variations.push(testSign(vector));
  });
  await Promise.all(variations);
})().then(common.mustCall());
