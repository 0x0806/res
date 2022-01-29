'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const p = 'FFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74' +
          '020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F1437' +
          '4FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7ED' +
          'EE386BFB5A899FA5AE9F24117C4B1FE649286651ECE65381FFFFFFFFFFFFFFFF';
crypto.createDiffieHellman(p, 'hex');
const bad_dh = crypto.createDiffieHellman('02', 'hex');
assert.notStrictEqual(bad_dh.verifyError, 0);
const availableCurves = new Set(crypto.getCurves());
const availableHashes = new Set(crypto.getHashes());
if (availableCurves.has('Oakley-EC2N-3')) {
  crypto.createECDH('Oakley-EC2N-3');
  crypto.createHash('sha256');
}
if (availableCurves.has('prime256v1') && availableCurves.has('secp256k1')) {
  const ecdh1 = crypto.createECDH('prime256v1');
  const ecdh2 = crypto.createECDH('prime256v1');
  const key1 = ecdh1.generateKeys();
  const key2 = ecdh2.generateKeys('hex');
  const secret1 = ecdh1.computeSecret(key2, 'hex', 'base64');
  const secret2 = ecdh2.computeSecret(key1, 'latin1', 'buffer');
  assert.strictEqual(secret1, secret2.toString('base64'));
  assert.strictEqual(ecdh1.getPublicKey('buffer', 'uncompressed')[0], 4);
  let firstByte = ecdh1.getPublicKey('buffer', 'compressed')[0];
  assert(firstByte === 2 || firstByte === 3);
  firstByte = ecdh1.getPublicKey('buffer', 'hybrid')[0];
  assert(firstByte === 6 || firstByte === 7);
  assert.throws(
    () => ecdh1.getPublicKey('buffer', 10),
    {
      code: 'ERR_CRYPTO_ECDH_INVALID_FORMAT',
      name: 'TypeError',
      message: 'Invalid ECDH format: 10'
    });
  const ecdh3 = crypto.createECDH('secp256k1');
  const key3 = ecdh3.generateKeys();
  assert.throws(
    () => ecdh2.computeSecret(key3, 'latin1', 'buffer'),
    {
      code: 'ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY',
      name: 'Error',
      message: 'Public key is not valid for specified curve'
    });
  const ecdh4 = crypto.createECDH('prime256v1');
  ecdh4.setPrivateKey(ecdh1.getPrivateKey());
  ecdh4.setPublicKey(ecdh1.getPublicKey());
  assert.throws(() => {
    ecdh4.setPublicKey(ecdh3.getPublicKey());
  }, { message: 'Failed to convert Buffer to EC_POINT' });
  const ecdh5 = crypto.createECDH('secp256k1');
  assert.throws(() => {
    ecdh5.getPublicKey();
  assert.throws(() => {
    ecdh5.getPrivateKey();
  const cafebabeKey = 'cafebabe'.repeat(8);
  const cafebabePubPtComp =
  '03672a31bfc59d3f04548ec9b7daeeba2f61814e8ccc40448045007f5479f693a3';
  const cafebabePubPtUnComp =
  '04672a31bfc59d3f04548ec9b7daeeba2f61814e8ccc40448045007f5479f693a3' +
  '2e02c7f93d13dc2732b760ca377a5897b9dd41a1c1b29dc0442fdce6d0a04d1d';
  ecdh5.setPrivateKey(cafebabeKey, 'hex');
  assert.strictEqual(ecdh5.getPrivateKey('hex'), cafebabeKey);
  assert.strictEqual(ecdh5.getPublicKey('hex'), cafebabePubPtUnComp);
  const peerPubPtComp =
  '02c6b754b20826eb925e052ee2c25285b162b51fdca732bcf67e39d647fb6830ae';
  const peerPubPtUnComp =
  '04c6b754b20826eb925e052ee2c25285b162b51fdca732bcf67e39d647fb6830ae' +
  'b651944a574a362082a77e3f2b5d9223eb54d7f2f76846522bf75f3bedb8178e';
  const sharedSecret =
  '1da220b5329bbe8bfd19ceef5a5898593f411a6f12ea40f2a8eead9a5cf59970';
  assert.strictEqual(ecdh5.computeSecret(peerPubPtComp, 'hex', 'hex'),
                     sharedSecret);
  assert.strictEqual(ecdh5.computeSecret(peerPubPtUnComp, 'hex', 'hex'),
                     sharedSecret);
  assert.strictEqual(ecdh5.getPrivateKey('hex'), cafebabeKey);
  assert.strictEqual(ecdh5.getPublicKey('hex'), cafebabePubPtUnComp);
  ecdh5.setPublicKey(cafebabePubPtComp, 'hex');
  assert.strictEqual(ecdh5.getPublicKey('hex'), cafebabePubPtUnComp);
  assert.strictEqual(
    ecdh5.getPublicKey('hex', 'compressed'),
    cafebabePubPtComp
  );
  ecdh5.setPublicKey(cafebabePubPtUnComp, 'hex');
  assert.strictEqual(ecdh5.getPublicKey('hex'), cafebabePubPtUnComp);
  assert.strictEqual(
    ecdh5.getPublicKey('hex', 'compressed'),
    cafebabePubPtComp
  );
  ecdh5.setPublicKey(peerPubPtComp, 'hex');
  assert.strictEqual(ecdh5.getPublicKey('hex'), peerPubPtUnComp);
  assert.throws(() => {
    ecdh5.computeSecret(peerPubPtComp, 'hex', 'hex');
  ecdh5.setPrivateKey(cafebabeKey, 'hex');
  ['0000000000000000000000000000000000000000000000000000000000000000',
   'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141',
   'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
  ].forEach((element) => {
    assert.throws(() => {
      ecdh5.setPrivateKey(element, 'hex');
    }, errMessage);
    assert.strictEqual(ecdh5.getPrivateKey('hex'), cafebabeKey);
  });
}
if (availableCurves.has('prime256v1') && availableHashes.has('sha256')) {
  const curve = crypto.createECDH('prime256v1');
  const invalidKey = Buffer.alloc(65);
  invalidKey.fill('\0');
  curve.generateKeys();
  assert.throws(
    () => curve.computeSecret(invalidKey),
    {
      code: 'ERR_CRYPTO_ECDH_INVALID_PUBLIC_KEY',
      name: 'Error',
      message: 'Public key is not valid for specified curve'
    });
  const ecPrivateKey =
    '-----BEGIN EC PRIVATE KEY-----\n' +
    'AwEHoUQDQgAEurOxfSxmqIRYzJVagdZfMMSjRNNhB8i3mXyIMq704m2m52FdfKZ2\n' +
    '-----END EC PRIVATE KEY-----';
  crypto.createSign('SHA256').sign(ecPrivateKey);
}
