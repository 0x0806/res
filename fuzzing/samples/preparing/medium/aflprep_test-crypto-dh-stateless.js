'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
assert.throws(() => crypto.diffieHellman(), {
  name: 'TypeError',
  code: 'ERR_INVALID_ARG_TYPE',
  message: 'The "options" argument must be of type object. Received undefined'
});
assert.throws(() => crypto.diffieHellman(null), {
  name: 'TypeError',
  code: 'ERR_INVALID_ARG_TYPE',
  message: 'The "options" argument must be of type object. Received null'
});
assert.throws(() => crypto.diffieHellman([]), {
  name: 'TypeError',
  code: 'ERR_INVALID_ARG_TYPE',
  message:
    'The "options" argument must be of type object. ' +
    'Received an instance of Array',
});
function test({ publicKey: alicePublicKey, privateKey: alicePrivateKey },
              { publicKey: bobPublicKey, privateKey: bobPrivateKey },
              expectedValue) {
  const buf1 = crypto.diffieHellman({
    privateKey: alicePrivateKey,
    publicKey: bobPublicKey
  });
  const buf2 = crypto.diffieHellman({
    privateKey: bobPrivateKey,
    publicKey: alicePublicKey
  });
  assert.deepStrictEqual(buf1, buf2);
  if (expectedValue !== undefined)
    assert.deepStrictEqual(buf1, expectedValue);
}
const alicePrivateKey = crypto.createPrivateKey({
  key: '-----BEGIN PRIVATE KEY-----\n' +
       'gNwc0SkCTgiKZ8x0Agu+pjsTmyJRSgh5jjQE3e+VGbPNOkMbMCsKbfJfFDdP4TVt\n' +
       'qYSImDFyg9sH6CJ0GzRK05e6hM3dOSClFYi4kbA7Pr7zyfdn2SH6wSlNS14Jyrtt\n' +
       'TGzJUoWInW39t0YgMXenJrkS0m6wol8Rhxx81AGgELNV7EHZqg==\n' +
       '-----END PRIVATE KEY-----',
  format: 'pem'
});
const alicePublicKey = crypto.createPublicKey({
  key: '-----BEGIN PUBLIC KEY-----\n' +
       '0SkCTgiKZ8x0Agu+pjsTmyJRSgh5jjQE3e+VGbPNOkMbMCsKbfJfFDdP4TVtbVHC\n' +
       'y2oLt7ST33sDKT+nxpag6cWDDWzPBKFDCJ8fr0v7yW453px8N4qi4R7SYYxFBaYN\n' +
       'Y3JvgDg1ct2JC9sxSuUOLqSFn3hpmAjW7cS0kExIVGfdLlYtIqbhhuo45cTEbVIM\n' +
       'rDEz8mjIlnvbWpKB9+uYmbjfVoc3leFvUBqfG2In2m23Md1swsPxr3n7g68H66JX\n' +
       '-----END PUBLIC KEY-----',
  format: 'pem'
});
const bobPrivateKey = crypto.createPrivateKey({
  key: '-----BEGIN PRIVATE KEY-----\n' +
       'gNwc0SkCTgiKZ8x0Agu+pjsTmyJRSgh5jjQE3e+VGbPNOkMbMCsKbfJfFDdP4TVt\n' +
       'eolzQFHQzyuT0y+3BF+FxK2Ox7VPguTp57wQfGHbORJ2cwCdLx2mFM7gk4tZ6COS\n' +
       '-----END PRIVATE KEY-----',
  format: 'pem'
});
const bobPublicKey = crypto.createPublicKey({
  key: '-----BEGIN PUBLIC KEY-----\n' +
       '0SkCTgiKZ8x0Agu+pjsTmyJRSgh5jjQE3e+VGbPNOkMbMCsKbfJfFDdP4TVtbVHC\n' +
       'Pw5OlO+TLrUelMVFaADEzoYomH0zVGb0sW4aBN8haC0mbrPt9QshgCvjr1hEPEna\n' +
       'QFKfjzNaJRNMFFd4f2Dn8MSB4yu1xpA1T2i0JSk24vS2H55jx24xhUYtfhT2LJgK\n' +
       '-----END PUBLIC KEY-----',
  format: 'pem'
});
assert.throws(() => crypto.diffieHellman({ privateKey: alicePrivateKey }), {
  name: 'TypeError',
  code: 'ERR_INVALID_ARG_VALUE',
  message: "The property 'options.publicKey' is invalid. Received undefined"
});
assert.throws(() => crypto.diffieHellman({ publicKey: alicePublicKey }), {
  name: 'TypeError',
  code: 'ERR_INVALID_ARG_VALUE',
  message: "The property 'options.privateKey' is invalid. Received undefined"
});
const privateKey = Buffer.from(
  '487CD880159D835FD0A8DBA9848898317283DB07E822741B344AD397BA84CDDD3920A51588' +
  'B891B03B3EBEF3C9F767D921FAC1294D4B5E09CABB6D1DE3EB4527989754FEB64D007EBBDA' +
  '2E6C8CE7A17EF41DE3C2DFE7CEAAF963199F55D5DBD9A415E77552FE69B7A41D87888B7D16' +
  '6BC569A3957B60EEA6A4ABEB1CDB7FFCF238DF961790791CD54E597B3082981D52C0B2CA0B' +
  '3DF212B2FD78DE4C6CC95285889D6DFDB746203177A726B912D26EB0A25F11871C7CD401A0' +
  '10B355EC41D9AA', 'hex');
const publicKey = Buffer.from(
  '8b6ea8abccff18d4819b7ce280db7b480edc02b5016d3c4835af622d85a9e9bc6bbc22b00d' +
  '0c0848ddfafd0530f275007bc691c8cb74a189fecbabd63f0e4e94ef932eb51e94c5456800' +
  'c4ce8628987d335466f4b16e1a04df21682d266eb3edf50b21802be3af58443c49da40529f' +
  '8f335a25134c1457787f60e7f0c481e32bb5c690354f68b4252936e2f4b61f9e63c76e3185' +
  '462d7e14f62c980a26f9da3837b2ff1b58e0aaa5d7464a7f8dcbc3a81d402dc6f28a42f4ec' +
  '55c6df68351ed9', 'hex');
const group = crypto.getDiffieHellman('modp5');
const dh = crypto.createDiffieHellman(group.getPrime(), group.getGenerator());
dh.setPrivateKey(privateKey);
test({ publicKey: alicePublicKey, privateKey: alicePrivateKey },
     { publicKey: bobPublicKey, privateKey: bobPrivateKey },
     dh.computeSecret(publicKey));
test(crypto.generateKeyPairSync('dh', { group: 'modp5' }),
     crypto.generateKeyPairSync('dh', { group: 'modp5' }));
test(crypto.generateKeyPairSync('dh', { group: 'modp5' }),
     crypto.generateKeyPairSync('dh', { prime: group.getPrime() }));
const list = [];
if (!common.hasOpenSSL3) {
  list.push([{ group: 'modp5' }, { group: 'modp18' }]);
  list.push([{ group: 'modp5' }, { prime: group.getPrime(), generator: 5 }]);
  list.push([{ primeLength: 1024 }, { primeLength: 1024 }]);
}
for (const [params1, params2] of list) {
  assert.throws(() => {
    test(crypto.generateKeyPairSync('dh', params1),
         crypto.generateKeyPairSync('dh', params2));
  }, common.hasOpenSSL3 ? {
    name: 'Error',
    code: 'ERR_OSSL_DH_INVALID_PUBLIC_KEY'
  } : {
    name: 'Error',
    code: 'ERR_OSSL_EVP_DIFFERENT_PARAMETERS'
  });
}
{
  const privateKey = crypto.createPrivateKey({
    key: '-----BEGIN PRIVATE KEY-----\n' +
         'gNwc0SkCTgiKZ8x0Agu+pjsTmyJRSgh5jjQE3e+VGbPNOkMbMCsKbfJfFDdP4TVt\n' +
         '2j6RUKYNj1Pv+B4zdMgiLLjILAs8WUfbHciU21KSJh1izVQaUQ==\n' +
         '-----END PRIVATE KEY-----'
  });
  const publicKey = crypto.createPublicKey({
    key: '-----BEGIN PUBLIC KEY-----\n' +
         '0SkCTgiKZ8x0Agu+pjsTmyJRSgh5jjQE3e+VGbPNOkMbMCsKbfJfFDdP4TVtbVHC\n' +
         'taGX4mP3247golVx2DS4viDYs7UtaMdx03dWaP6y5StNUZQlgCIUzL7MYpC16V5y\n' +
         '-----END PUBLIC KEY-----',
    format: 'pem'
  });
  const secret = crypto.diffieHellman({ publicKey, privateKey });
  assert.strictEqual(secret.toString('hex'),
                     '0099d0fa242af5db9ea7330e23937a27db041f79c581500fc7f9976' +
                     '554d59d5b9ced934778d72e19a1fefc81e9d981013198748c0b5c6c' +
                     '762985eec687dc5bec5c9367b05837daee9d0bcc29024ed7f3abba1' +
                     '2794b65a745117fb0d87bc5b1b2b68c296c3f686cc29e450e4e1239' +
                     '21f56a5733fe58aabf71f14582954059c2185d342b9b0fa10c2598a' +
                     '5426c2baee7f9a686fc1e16cd4757c852bf7225a2732250548efe28' +
                     'debc26f1acdec51efe23d20786a6f8a14d360803bbc71972e87fd3');
}
test(crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' }),
     crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' }));
assert.throws(() => {
  test(crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' }),
       crypto.generateKeyPairSync('ec', { namedCurve: not256k1 }));
}, common.hasOpenSSL3 ? {
  name: 'Error',
  code: 'ERR_OSSL_MISMATCHING_DOMAIN_PARAMETERS'
} : {
  name: 'Error',
  code: 'ERR_OSSL_EVP_DIFFERENT_PARAMETERS'
});
test(crypto.generateKeyPairSync('x448'),
     crypto.generateKeyPairSync('x448'));
test(crypto.generateKeyPairSync('x25519'),
     crypto.generateKeyPairSync('x25519'));
assert.throws(() => {
  test(crypto.generateKeyPairSync('x448'),
       crypto.generateKeyPairSync('x25519'));
}, {
  name: 'Error',
  code: 'ERR_CRYPTO_INCOMPATIBLE_KEY',
  message: 'Incompatible key types for Diffie-Hellman: x448 and x25519'
});
