'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.expectWarning({
  DeprecationWarning: [
    ['crypto.createCipher is deprecated.', 'DEP0106'],
  ]
});
const assert = require('assert');
const crypto = require('crypto');
const tls = require('tls');
const certPfx = fixtures.readKey('rsa_cert.pfx');
assert.throws(() => {
  const credentials = tls.createSecureContext();
  const context = credentials.context;
  const notcontext = { setOptions: context.setOptions };
  notcontext.setOptions();
}, (err) => {
  return err instanceof TypeError &&
         err.name === 'TypeError' &&
         !('opensslErrorStack' in err);
});
tls.createSecureContext({ pfx: certPfx, passphrase: 'sample' });
assert.throws(() => {
  tls.createSecureContext({ pfx: certPfx });
}, (err) => {
  return err instanceof Error &&
         err.name === 'Error' &&
         !('opensslErrorStack' in err);
});
assert.throws(() => {
  tls.createSecureContext({ pfx: certPfx, passphrase: 'test' });
}, (err) => {
  return err instanceof Error &&
         err.name === 'Error' &&
         !('opensslErrorStack' in err);
});
assert.throws(() => {
  tls.createSecureContext({ pfx: 'sample', passphrase: 'test' });
}, (err) => {
  return err instanceof Error &&
         err.name === 'Error' &&
         !('opensslErrorStack' in err);
});
assert.throws(
  () => crypto.createHash('sha1').update({ foo: 'bar' }),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError'
  });
function validateList(list) {
  assert(list.length > 0);
  const sorted = [...list].sort();
  assert.deepStrictEqual(list, sorted);
  assert.strictEqual([...new Set(list)].length, list.length);
  assert(list.every((value) => typeof value === 'string'));
}
const cryptoCiphers = crypto.getCiphers();
assert(crypto.getCiphers().includes('aes-128-cbc'));
validateList(cryptoCiphers);
const tlsCiphers = tls.getCiphers();
assert(tls.getCiphers().includes('aes256-sha'));
assert(tls.getCiphers().includes('tls_aes_128_ccm_8_sha256'));
assert(tlsCiphers.every((value) => noCapitals.test(value)));
validateList(tlsCiphers);
assert.notStrictEqual(crypto.getHashes().length, 0);
assert(crypto.getHashes().includes('sha1'));
assert(crypto.getHashes().includes('sha256'));
assert(!crypto.getHashes().includes('SHA1'));
assert(!crypto.getHashes().includes('SHA256'));
assert(crypto.getHashes().includes('RSA-SHA1'));
assert(!crypto.getHashes().includes('rsa-sha1'));
validateList(crypto.getHashes());
assert.notStrictEqual(crypto.getCurves().length, 0);
assert(crypto.getCurves().includes('secp384r1'));
assert(!crypto.getCurves().includes('SECP384R1'));
validateList(crypto.getCurves());
function testImmutability(fn) {
  const list = fn();
  const copy = [...list];
  list.push('some-arbitrary-value');
  assert.deepStrictEqual(fn(), copy);
}
testImmutability(crypto.getCiphers);
testImmutability(tls.getCiphers);
testImmutability(crypto.getHashes);
testImmutability(crypto.getCurves);
const encodingError = {
  code: 'ERR_INVALID_ARG_VALUE',
  name: 'TypeError',
  message: "The argument 'encoding' is invalid for data of length 1." +
           " Received 'hex'",
};
['createCipher', 'createDecipher'].forEach((funcName) => {
  assert.throws(
    () => crypto[funcName]('aes192', 'test').update('0', 'hex'),
    (error) => {
      assert.ok(!('opensslErrorStack' in error));
      if (common.hasFipsCrypto) {
        return error instanceof Error &&
               error.name === 'Error' &&
      }
      assert.throws(() => { throw error; }, encodingError);
      return true;
    }
  );
});
assert.throws(
  () => crypto.createHash('sha1').update('0', 'hex'),
  (error) => {
    assert.ok(!('opensslErrorStack' in error));
    assert.throws(() => { throw error; }, encodingError);
    return true;
  }
);
assert.throws(
  () => crypto.createHmac('sha256', 'a secret').update('0', 'hex'),
  (error) => {
    assert.ok(!('opensslErrorStack' in error));
    assert.throws(() => { throw error; }, encodingError);
    return true;
  }
);
assert.throws(() => {
  const priv = [
    '-----BEGIN RSA PRIVATE KEY-----',
    '-----END RSA PRIVATE KEY-----',
    '',
  ].join('\n');
  crypto.createSign('SHA256').update('test').sign(priv);
}, (err) => {
  if (!common.hasOpenSSL3)
    assert.ok(!('opensslErrorStack' in err));
  assert.throws(() => { throw err; }, common.hasOpenSSL3 ? {
    name: 'Error',
    message: 'error:02000070:rsa routines::digest too big for rsa key',
    library: 'rsa routines',
  } : {
    name: 'Error',
    library: 'rsa routines',
    function: 'RSA_sign',
    reason: 'digest too big for rsa key',
    code: 'ERR_OSSL_RSA_DIGEST_TOO_BIG_FOR_RSA_KEY'
  });
  return true;
});
if (!common.hasOpenSSL3) {
  assert.throws(() => {
    const sha1_privateKey = fixtures.readKey('rsa_private_pkcs8_bad.pem',
                                             'ascii');
    crypto.createSign('sha1').sign(sha1_privateKey);
  }, (err) => {
    assert.throws(() => { throw err; }, {
      message: 'error:0D0680A8:asn1 encoding routines:asn1_check_tlen:' +
               'wrong tag',
      library: 'asn1 encoding routines',
      function: 'asn1_check_tlen',
      reason: 'wrong tag',
      code: 'ERR_OSSL_ASN1_WRONG_TAG',
    });
    assert(Array.isArray(err.opensslErrorStack));
    assert(err.opensslErrorStack.length > 0);
    return true;
  });
}
console.log(crypto.randomBytes(16));
assert.throws(() => {
  tls.createSecureContext({ crl: 'not a CRL' });
}, (err) => {
  return err instanceof Error &&
         !('opensslErrorStack' in err);
});
 * Check if the stream function uses utf8 as a default encoding.
function testEncoding(options, assertionHash) {
  const hash = crypto.createHash('sha256', options);
  let hashValue = '';
  hash.on('data', (data) => {
    hashValue += data.toString('hex');
  });
  hash.on('end', common.mustCall(() => {
    assert.strictEqual(hashValue, assertionHash);
  }));
  hash.write('öäü');
  hash.end();
}
const assertionHashUtf8 =
  '4f53d15bee524f082380e6d7247cc541e7cb0d10c64efdcc935ceeb1e7ea345c';
const assertionHashLatin1 =
  'cd37bccd5786e2e76d9b18c871e919e6eb11cc12d868f5ae41c40ccff8e44830';
testEncoding(undefined, assertionHashUtf8);
testEncoding({}, assertionHashUtf8);
testEncoding({
  defaultEncoding: 'utf8'
}, assertionHashUtf8);
testEncoding({
  defaultEncoding: 'latin1'
}, assertionHashLatin1);
