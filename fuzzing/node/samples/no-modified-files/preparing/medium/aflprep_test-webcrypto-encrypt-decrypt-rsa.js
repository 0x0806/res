'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const { subtle } = require('crypto').webcrypto;
const {
  passing
async function importVectorKey(
  publicKeyBuffer,
  privateKeyBuffer,
  name,
  hash,
  publicUsages,
  privateUsages) {
  const [publicKey, privateKey] = await Promise.all([
    subtle.importKey(
      'spki', publicKeyBuffer, { name, hash }, false, publicUsages),
    subtle.importKey(
      'pkcs8', privateKeyBuffer, { name, hash }, false, privateUsages),
  ]);
  return { publicKey, privateKey };
}
async function testDecryption({ ciphertext,
                                algorithm,
                                plaintext,
                                hash,
                                publicKeyBuffer,
                                privateKeyBuffer }) {
  if (ciphertext === undefined)
    return;
  const {
    privateKey
  } = await importVectorKey(
    publicKeyBuffer,
    privateKeyBuffer,
    algorithm.name,
    hash,
    ['encrypt'],
    ['decrypt']);
  const encodedPlaintext = Buffer.from(plaintext).toString('hex');
  const result = await subtle.decrypt(algorithm, privateKey, ciphertext);
  assert.strictEqual(
    Buffer.from(result).toString('hex'),
    encodedPlaintext);
  const ciphercopy = Buffer.from(ciphertext);
  const result2 = await subtle.decrypt(algorithm, privateKey, ciphercopy);
  ciphercopy[0] = 255 - ciphercopy[0];
  assert.strictEqual(
    Buffer.from(result2).toString('hex'),
    encodedPlaintext);
}
async function testEncryption(
  {
    ciphertext,
    algorithm,
    plaintext,
    hash,
    publicKeyBuffer,
    privateKeyBuffer
  },
  modify = false) {
  const {
    publicKey,
    privateKey
  } = await importVectorKey(
    publicKeyBuffer,
    privateKeyBuffer,
    algorithm.name,
    hash,
    ['encrypt'],
    ['decrypt']);
  if (modify)
  const encodedPlaintext = Buffer.from(plaintext).toString('hex');
  const result = await subtle.encrypt(algorithm, publicKey, plaintext);
  if (modify)
    plaintext[0] = 255 - plaintext[0];
  assert.strictEqual(
    result.byteLength * 8,
    privateKey.algorithm.modulusLength);
  const out = await subtle.decrypt(algorithm, privateKey, result);
  assert.strictEqual(
    Buffer.from(out).toString('hex'),
    encodedPlaintext);
}
async function testEncryptionLongPlaintext({ algorithm,
                                             plaintext,
                                             hash,
                                             publicKeyBuffer,
                                             privateKeyBuffer }) {
  const {
    publicKey,
  } = await importVectorKey(
    publicKeyBuffer,
    privateKeyBuffer,
    algorithm.name,
    hash,
    ['encrypt'],
    ['decrypt']);
  const newplaintext = new Uint8Array(plaintext.byteLength + 1);
  newplaintext.set(plaintext, 0);
  newplaintext[plaintext.byteLength] = 32;
  return assert.rejects(
    subtle.encrypt(algorithm, publicKey, newplaintext), {
    });
}
async function testEncryptionWrongKey({ algorithm,
                                        plaintext,
                                        hash,
                                        publicKeyBuffer,
                                        privateKeyBuffer }) {
  const {
    privateKey,
  } = await importVectorKey(
    publicKeyBuffer,
    privateKeyBuffer,
    algorithm.name,
    hash,
    ['encrypt'],
    ['decrypt']);
  return assert.rejects(
    subtle.encrypt(algorithm, privateKey, plaintext), {
    });
}
async function testEncryptionBadUsage({ algorithm,
                                        plaintext,
                                        hash,
                                        publicKeyBuffer,
                                        privateKeyBuffer }) {
  const {
    publicKey,
  } = await importVectorKey(
    publicKeyBuffer,
    privateKeyBuffer,
    algorithm.name,
    hash,
    ['wrapKey'],
    ['decrypt']);
  return assert.rejects(
    subtle.encrypt(algorithm, publicKey, plaintext), {
    });
}
async function testDecryptionWrongKey({ ciphertext,
                                        algorithm,
                                        hash,
                                        publicKeyBuffer,
                                        privateKeyBuffer }) {
  if (ciphertext === undefined)
    return;
  const {
    publicKey
  } = await importVectorKey(
    publicKeyBuffer,
    privateKeyBuffer,
    algorithm.name,
    hash,
    ['encrypt'],
    ['decrypt']);
  return assert.rejects(
    subtle.decrypt(algorithm, publicKey, ciphertext), {
    });
}
async function testDecryptionBadUsage({ ciphertext,
                                        algorithm,
                                        hash,
                                        publicKeyBuffer,
                                        privateKeyBuffer }) {
  if (ciphertext === undefined)
    return;
  const {
    publicKey
  } = await importVectorKey(
    publicKeyBuffer,
    privateKeyBuffer,
    algorithm.name,
    hash,
    ['encrypt'],
    ['unwrapKey']);
  return assert.rejects(
    subtle.decrypt(algorithm, publicKey, ciphertext), {
    });
}
(async function() {
  const variations = [];
  passing.forEach(async (vector) => {
    variations.push(testDecryption(vector));
    variations.push(testDecryptionWrongKey(vector));
    variations.push(testDecryptionBadUsage(vector));
    variations.push(testEncryption(vector));
    variations.push(testEncryption(vector, true));
    variations.push(testEncryptionLongPlaintext(vector));
    variations.push(testEncryptionWrongKey(vector));
    variations.push(testEncryptionBadUsage(vector));
  });
  await Promise.all(variations);
})().then(common.mustCall());
