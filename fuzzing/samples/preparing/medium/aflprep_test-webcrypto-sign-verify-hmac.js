'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { subtle } = require('crypto').webcrypto;
async function testVerify({ hash,
                            keyBuffer,
                            signature,
                            plaintext }) {
  const name = 'HMAC';
  const [
    key,
    noVerifyKey,
    rsaKeys,
  ] = await Promise.all([
    subtle.importKey(
      'raw',
      keyBuffer,
      { name, hash },
      false,
      ['verify']),
    subtle.importKey(
      'raw',
      keyBuffer,
      { name, hash },
      false,
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
  assert(await subtle.verify({ name, hash }, key, signature, plaintext));
  const copy = Buffer.from(plaintext);
  const sigcopy = Buffer.from(signature);
  const p = subtle.verify({ name, hash }, key, sigcopy, copy);
  copy[0] = 255 - copy[0];
  sigcopy[0] = 255 - sigcopy[0];
  assert(await p);
  await assert.rejects(
    subtle.verify({ name, hash }, noVerifyKey, signature, plaintext), {
    });
  await assert.rejects(
    subtle.verify({ name, hash }, rsaKeys.publicKey, signature, plaintext), {
    });
  {
    const copy = Buffer.from(signature);
    copy[0] = 255 - copy[0];
    assert(!(await subtle.verify(
      { name, hash },
      key,
      copy,
      plaintext)));
    assert(!(await subtle.verify(
      { name, hash },
      key,
      copy.slice(1),
      plaintext)));
  }
  {
    const copy = Buffer.from(plaintext);
    copy[0] = 255 - copy[0];
    assert(!(await subtle.verify({ name, hash }, key, signature, copy)));
  }
  {
    const otherhash = hash === 'SHA-1' ? 'SHA-256' : 'SHA-1';
    assert(!(await subtle.verify({
      name,
      hash: otherhash
    }, key, signature, copy)));
  }
  await assert.rejects(
    subtle.verify({ name, hash: 'sha256' }, key, signature, copy), {
    });
}
async function testSign({ hash,
                          keyBuffer,
                          signature,
                          plaintext }) {
  const name = 'HMAC';
  const [
    key,
    noSignKey,
    rsaKeys,
  ] = await Promise.all([
    subtle.importKey(
      'raw',
      keyBuffer,
      { name, hash },
      false,
      ['verify', 'sign']),
    subtle.importKey(
      'raw',
      keyBuffer,
      { name, hash },
      false,
      [ 'verify' ]),
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
    const sig = await subtle.sign({ name, hash }, key, plaintext);
    assert.strictEqual(
      Buffer.from(sig).toString('hex'),
      signature.toString('hex'));
    assert(await subtle.verify({ name, hash }, key, sig, plaintext));
  }
  {
    const copy = Buffer.from(plaintext);
    const p = subtle.sign({ name, hash }, key, copy);
    copy[0] = 255 - copy[0];
    const sig = await p;
    assert(await subtle.verify({ name, hash }, key, sig, plaintext));
  }
  await assert.rejects(
    subtle.generateKey({ name }, false, []), {
      name: 'TypeError',
      code: 'ERR_MISSING_OPTION',
      message: 'algorithm.hash is required'
    });
  await assert.rejects(
    subtle.sign({ name, hash }, noSignKey, plaintext), {
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
