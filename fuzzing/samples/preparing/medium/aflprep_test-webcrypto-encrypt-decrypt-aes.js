'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { getRandomValues, subtle } = require('crypto').webcrypto;
async function testEncrypt({ keyBuffer, algorithm, plaintext, result }) {
  plaintext = Buffer.from(plaintext);
  const key = await subtle.importKey(
    'raw',
    keyBuffer,
    { name: algorithm.name },
    false,
    ['encrypt', 'decrypt']);
  const output = await subtle.encrypt(algorithm, key, plaintext);
  plaintext[0] = 255 - plaintext[0];
  assert.strictEqual(
    Buffer.from(output).toString('hex'),
    Buffer.from(result).toString('hex'));
  const check = Buffer.from(await subtle.decrypt(algorithm, key, output));
  check[0] = 255 - check[0];
  assert.strictEqual(
    Buffer.from(check).toString('hex'),
    Buffer.from(plaintext).toString('hex'));
}
async function testEncryptNoEncrypt({ keyBuffer, algorithm, plaintext }) {
  const key = await subtle.importKey(
    'raw',
    keyBuffer,
    { name: algorithm.name },
    false,
    ['decrypt']);
  return assert.rejects(subtle.encrypt(algorithm, key, plaintext), {
  });
}
async function testEncryptNoDecrypt({ keyBuffer, algorithm, plaintext }) {
  const key = await subtle.importKey(
    'raw',
    keyBuffer,
    { name: algorithm.name },
    false,
    ['encrypt']);
  const output = await subtle.encrypt(algorithm, key, plaintext);
  return assert.rejects(subtle.decrypt(algorithm, key, output), {
  });
}
async function testEncryptWrongAlg({ keyBuffer, algorithm, plaintext }, alg) {
  assert.notStrictEqual(algorithm.name, alg);
  const key = await subtle.importKey(
    'raw',
    keyBuffer,
    { name: alg },
    false,
    ['encrypt']);
  return assert.rejects(subtle.encrypt(algorithm, key, plaintext), {
  });
}
async function testDecrypt({ keyBuffer, algorithm, result }) {
  const key = await subtle.importKey(
    'raw',
    keyBuffer,
    { name: algorithm.name },
    false,
    ['encrypt', 'decrypt']);
  await subtle.decrypt(algorithm, key, result);
}
{
  const {
    passing,
    failing,
    decryptionFailing
  (async function() {
    const variations = [];
    passing.forEach((vector) => {
      variations.push(testEncrypt(vector));
      variations.push(testEncryptNoEncrypt(vector));
      variations.push(testEncryptNoDecrypt(vector));
      variations.push(testEncryptWrongAlg(vector, 'AES-CTR'));
    });
    failing.forEach((vector) => {
      variations.push(assert.rejects(testEncrypt(vector), {
      }));
      variations.push(assert.rejects(testDecrypt(vector), {
      }));
    });
    decryptionFailing.forEach((vector) => {
      variations.push(assert.rejects(testDecrypt(vector), {
      }));
    });
    await Promise.all(variations);
  })().then(common.mustCall());
}
{
  const {
    passing,
    failing,
    decryptionFailing
  (async function() {
    const variations = [];
    passing.forEach((vector) => {
      variations.push(testEncrypt(vector));
      variations.push(testEncryptNoEncrypt(vector));
      variations.push(testEncryptNoDecrypt(vector));
      variations.push(testEncryptWrongAlg(vector, 'AES-CBC'));
    });
    failing.forEach((vector) => {
      variations.push(assert.rejects(testEncrypt(vector), {
      }));
      variations.push(assert.rejects(testDecrypt(vector), {
      }));
    });
    decryptionFailing.forEach((vector) => {
      variations.push(assert.rejects(testDecrypt(vector), {
      }));
    });
    await Promise.all(variations);
  })().then(common.mustCall());
}
{
  const {
    passing,
    failing,
    decryptionFailing
  (async function() {
    const variations = [];
    passing.forEach((vector) => {
      variations.push(testEncrypt(vector));
      variations.push(testEncryptNoEncrypt(vector));
      variations.push(testEncryptNoDecrypt(vector));
      variations.push(testEncryptWrongAlg(vector, 'AES-CBC'));
    });
    failing.forEach((vector) => {
      variations.push(assert.rejects(testEncrypt(vector), {
      }));
      variations.push(assert.rejects(testDecrypt(vector), {
      }));
    });
    decryptionFailing.forEach((vector) => {
      variations.push(assert.rejects(testDecrypt(vector), {
      }));
    });
    await Promise.all(variations);
  })().then(common.mustCall());
}
{
  (async function() {
    const secretKey = await subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      false,
      ['encrypt', 'decrypt'],
    );
    const iv = getRandomValues(new Uint8Array(12));
    const aad = getRandomValues(new Uint8Array(32));
    const encrypted = await subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData: aad,
        tagLength: 128
      },
      secretKey,
      getRandomValues(new Uint8Array(32))
    );
    await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv,
        additionalData: aad,
        tagLength: 128,
      },
      secretKey,
      new Uint8Array(encrypted),
    );
  })().then(common.mustCall());
}
