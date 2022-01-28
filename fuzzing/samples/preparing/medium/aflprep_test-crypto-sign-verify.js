'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;
const crypto = require('crypto');
const certPem = fixtures.readKey('rsa_cert.crt');
const keyPem = fixtures.readKey('rsa_private.pem');
const keySize = 2048;
{
  const Sign = crypto.Sign;
  const instance = Sign('SHA256');
  assert(instance instanceof Sign, 'Sign is expected to return a new ' +
                                   'instance when called without `new`');
}
{
  const Verify = crypto.Verify;
  const instance = Verify('SHA256');
  assert(instance instanceof Verify, 'Verify is expected to return a new ' +
                                     'instance when called without `new`');
}
{
  const library = {
    configurable: true,
    set() {
      throw new Error('bye, bye, library');
    }
  };
  Object.defineProperty(Object.prototype, 'library', library);
  assert.throws(() => {
    crypto.createSign('sha1').sign(
      `-----BEGIN RSA PRIVATE KEY-----
      AAAAAAAAAAAA
      -----END RSA PRIVATE KEY-----`);
  }, { message: 'bye, bye, library' });
  delete Object.prototype.library;
  const errorStack = {
    configurable: true,
    set() {
      throw new Error('bye, bye, error stack');
    }
  };
  Object.defineProperty(Object.prototype, 'opensslErrorStack', errorStack);
  assert.throws(() => {
    crypto.createSign('SHA1')
      .update('Test123')
      .sign({
        key: keyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      });
  }, { message: common.hasOpenSSL3 ?
    'error:1C8000A5:Provider routines::illegal or unsupported padding mode' :
    'bye, bye, error stack' });
  delete Object.prototype.opensslErrorStack;
}
assert.throws(
  () => crypto.createVerify('SHA256').verify({
    key: certPem,
    padding: null,
  }, ''),
  {
    code: 'ERR_INVALID_ARG_VALUE',
    name: 'TypeError',
    message: "The property 'options.padding' is invalid. Received null",
  });
assert.throws(
  () => crypto.createVerify('SHA256').verify({
    key: certPem,
    saltLength: null,
  }, ''),
  {
    code: 'ERR_INVALID_ARG_VALUE',
    name: 'TypeError',
    message: "The property 'options.saltLength' is invalid. Received null",
  });
{
  const s1 = crypto.createSign('SHA1')
                   .update('Test123')
                   .sign(keyPem, 'base64');
  let s1stream = crypto.createSign('SHA1');
  s1stream.end('Test123');
  s1stream = s1stream.sign(keyPem, 'base64');
  assert.strictEqual(s1, s1stream, `${s1} should equal ${s1stream}`);
  const verified = crypto.createVerify('SHA1')
                         .update('Test')
                         .update('123')
                         .verify(certPem, s1, 'base64');
  assert.strictEqual(verified, true);
}
{
  const s2 = crypto.createSign('SHA256')
                   .update('Test123')
                   .sign(keyPem, 'latin1');
  let s2stream = crypto.createSign('SHA256');
  s2stream.end('Test123');
  s2stream = s2stream.sign(keyPem, 'latin1');
  assert.strictEqual(s2, s2stream, `${s2} should equal ${s2stream}`);
  let verified = crypto.createVerify('SHA256')
                       .update('Test')
                       .update('123')
                       .verify(certPem, s2, 'latin1');
  assert.strictEqual(verified, true);
  const verStream = crypto.createVerify('SHA256');
  verStream.write('Tes');
  verStream.write('t12');
  verStream.end('3');
  verified = verStream.verify(certPem, s2, 'latin1');
  assert.strictEqual(verified, true);
}
{
  const s3 = crypto.createSign('SHA1')
                   .update('Test123')
                   .sign(keyPem, 'buffer');
  let verified = crypto.createVerify('SHA1')
                       .update('Test')
                       .update('123')
                       .verify(certPem, s3);
  assert.strictEqual(verified, true);
  const verStream = crypto.createVerify('SHA1');
  verStream.write('Tes');
  verStream.write('t12');
  verStream.end('3');
  verified = verStream.verify(certPem, s3);
  assert.strictEqual(verified, true);
}
{
  function testPSS(algo, hLen) {
    function getEffectiveSaltLength(saltLength) {
      switch (saltLength) {
        case crypto.constants.RSA_PSS_SALTLEN_DIGEST:
          return hLen;
        case crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN:
          return max;
        default:
          return saltLength;
      }
    }
    const signSaltLengths = [
      crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      getEffectiveSaltLength(crypto.constants.RSA_PSS_SALTLEN_DIGEST),
      crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN,
      getEffectiveSaltLength(crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN),
      0, 16, 32, 64, 128,
    ];
    const verifySaltLengths = [
      crypto.constants.RSA_PSS_SALTLEN_DIGEST,
      getEffectiveSaltLength(crypto.constants.RSA_PSS_SALTLEN_DIGEST),
      getEffectiveSaltLength(crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN),
      0, 16, 32, 64, 128,
    ];
    const data = Buffer.from('Test123');
    signSaltLengths.forEach((signSaltLength) => {
      if (signSaltLength > max) {
        assert.throws(() => {
          crypto.createSign(algo)
            .update(data)
            .sign({
              key: keyPem,
              padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
              saltLength: signSaltLength
            });
        }, errMessage);
        assert.throws(() => {
          crypto.sign(algo, data, {
            key: keyPem,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: signSaltLength
          });
        }, errMessage);
      } else {
        const s4 = crypto.createSign(algo)
                         .update(data)
                         .sign({
                           key: keyPem,
                           padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                           saltLength: signSaltLength
                         });
        const s4_2 = crypto.sign(algo, data, {
          key: keyPem,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
          saltLength: signSaltLength
        });
        [s4, s4_2].forEach((sig) => {
          let verified;
          verifySaltLengths.forEach((verifySaltLength) => {
            verified = crypto.createVerify(algo)
                             .update(data)
                             .verify({
                               key: certPem,
                               padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                               saltLength: verifySaltLength
                             }, sig);
            assert.strictEqual(verified, crypto.verify(algo, data, {
              key: certPem,
              padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
              saltLength: verifySaltLength
            }, sig));
            const saltLengthCorrect = getEffectiveSaltLength(signSaltLength) ===
                                      getEffectiveSaltLength(verifySaltLength);
            assert.strictEqual(verified, saltLengthCorrect);
          });
          verified = crypto.createVerify(algo)
                           .update(data)
                           .verify({
                             key: certPem,
                             padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                             saltLength: crypto.constants.RSA_PSS_SALTLEN_AUTO
                           }, sig);
          assert.strictEqual(verified, true);
          assert.strictEqual(verified, crypto.verify(algo, data, {
            key: certPem,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_AUTO
          }, sig));
          const wrongData = Buffer.from('Test1234');
          verified = crypto.createVerify(algo)
                           .update(wrongData)
                           .verify({
                             key: certPem,
                             padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                             saltLength: crypto.constants.RSA_PSS_SALTLEN_AUTO
                           }, sig);
          assert.strictEqual(verified, false);
          assert.strictEqual(verified, crypto.verify(algo, wrongData, {
            key: certPem,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: crypto.constants.RSA_PSS_SALTLEN_AUTO
          }, sig));
        });
      }
    });
  }
  testPSS('SHA1', 20);
  testPSS('SHA256', 32);
}
{
  function testVerify(cert, vector) {
    const verified = crypto.createVerify('SHA1')
                          .update(Buffer.from(vector.message, 'hex'))
                          .verify({
                            key: cert,
                            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
                          }, vector.signature, 'hex');
    assert.strictEqual(verified, true);
  }
  const examples = JSON.parse(fixtures.readSync('pss-vectors.json', 'utf8'));
  for (const key in examples) {
    const example = examples[key];
    const publicKey = example.publicKey.join('\n');
    example.tests.forEach((test) => testVerify(publicKey, test));
  }
}
{
  [null, NaN, 'boom', {}, [], true, false]
    .forEach((invalidValue) => {
      assert.throws(() => {
        crypto.createSign('SHA256')
          .update('Test123')
          .sign({
            key: keyPem,
            padding: invalidValue
          });
      }, {
        code: 'ERR_INVALID_ARG_VALUE',
        name: 'TypeError'
      });
      assert.throws(() => {
        crypto.createSign('SHA256')
          .update('Test123')
          .sign({
            key: keyPem,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            saltLength: invalidValue
          });
      }, {
        code: 'ERR_INVALID_ARG_VALUE',
        name: 'TypeError'
      });
    });
  assert.throws(() => {
    crypto.createSign('SHA1')
      .update('Test123')
      .sign({
        key: keyPem,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
      });
  }, common.hasOpenSSL3 ? {
    code: 'ERR_OSSL_ILLEGAL_OR_UNSUPPORTED_PADDING_MODE',
  } : {
    code: 'ERR_OSSL_RSA_ILLEGAL_OR_UNSUPPORTED_PADDING_MODE',
    opensslErrorStack: [
      'error:06089093:digital envelope routines:EVP_PKEY_CTX_ctrl:' +
      'command not supported',
    ],
  });
}
{
  assert.throws(() => {
    crypto.createSign('SHA1').update('Test123').sign(null, 'base64');
  }, {
    code: 'ERR_CRYPTO_SIGN_KEY_REQUIRED',
    name: 'Error'
  });
}
{
  const sign = crypto.createSign('SHA1');
  const verify = crypto.createVerify('SHA1');
  [1, [], {}, undefined, null, true, Infinity].forEach((input) => {
    const errObj = {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "algorithm" argument must be of type string.' +
               `${common.invalidArgTypeHelper(input)}`
    };
    assert.throws(() => crypto.createSign(input), errObj);
    assert.throws(() => crypto.createVerify(input), errObj);
    errObj.message = 'The "data" argument must be of type string or an ' +
                     'instance of Buffer, TypedArray, or DataView.' +
                     common.invalidArgTypeHelper(input);
    assert.throws(() => sign.update(input), errObj);
    assert.throws(() => verify.update(input), errObj);
    assert.throws(() => sign._write(input, 'utf8', () => {}), errObj);
    assert.throws(() => verify._write(input, 'utf8', () => {}), errObj);
  });
  [
    Uint8Array, Uint16Array, Uint32Array, Float32Array, Float64Array,
  ].forEach((clazz) => {
    sign.update(new clazz());
    verify.update(new clazz());
  });
  [1, {}, [], Infinity].forEach((input) => {
    const errObj = {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    };
    assert.throws(() => sign.sign(input), errObj);
    assert.throws(() => verify.verify(input), errObj);
    assert.throws(() => verify.verify('test', input), errObj);
  });
}
{
  assert.throws(
    () => crypto.createSign('sha8'),
  assert.throws(
    () => crypto.sign('sha8', Buffer.alloc(1), keyPem),
}
[
  { private: fixtures.readKey('ed25519_private.pem', 'ascii'),
    public: fixtures.readKey('ed25519_public.pem', 'ascii'),
    algo: null,
    sigLen: 64 },
  { private: fixtures.readKey('ed448_private.pem', 'ascii'),
    public: fixtures.readKey('ed448_public.pem', 'ascii'),
    algo: null,
    sigLen: 114 },
  { private: fixtures.readKey('rsa_private_2048.pem', 'ascii'),
    public: fixtures.readKey('rsa_public_2048.pem', 'ascii'),
    algo: 'sha1',
    sigLen: 256 },
].forEach((pair) => {
  const algo = pair.algo;
  {
    const data = Buffer.from('Hello world');
    const sig = crypto.sign(algo, data, pair.private);
    assert.strictEqual(sig.length, pair.sigLen);
    assert.strictEqual(crypto.verify(algo, data, pair.private, sig),
                       true);
    assert.strictEqual(crypto.verify(algo, data, pair.public, sig),
                       true);
  }
  {
    const data = Buffer.from('Hello world');
    const privKeyObj = crypto.createPrivateKey(pair.private);
    const pubKeyObj = crypto.createPublicKey(pair.public);
    const sig = crypto.sign(algo, data, privKeyObj);
    assert.strictEqual(sig.length, pair.sigLen);
    assert.strictEqual(crypto.verify(algo, data, privKeyObj, sig), true);
    assert.strictEqual(crypto.verify(algo, data, pubKeyObj, sig), true);
  }
  {
    const data = Buffer.from('Hello world');
    const otherData = Buffer.from('Goodbye world');
    const otherSig = crypto.sign(algo, otherData, pair.private);
    assert.strictEqual(crypto.verify(algo, data, pair.private, otherSig),
                       false);
  }
  [
    Uint8Array, Uint16Array, Uint32Array, Float32Array, Float64Array,
  ].forEach((clazz) => {
    const data = new clazz();
    const sig = crypto.sign(algo, data, pair.private);
    assert.strictEqual(crypto.verify(algo, data, pair.private, sig),
                       true);
  });
});
[1, {}, [], true, Infinity].forEach((input) => {
  const data = Buffer.alloc(1);
  const sig = Buffer.alloc(1);
  const errObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  };
  assert.throws(() => crypto.sign(null, input, 'asdf'), errObj);
  assert.throws(() => crypto.verify(null, input, 'asdf', sig), errObj);
  assert.throws(() => crypto.sign(null, data, input), errObj);
  assert.throws(() => crypto.verify(null, data, input, sig), errObj);
  errObj.message = 'The "signature" argument must be an instance of ' +
                   'Buffer, TypedArray, or DataView.' +
                   common.invalidArgTypeHelper(input);
  assert.throws(() => crypto.verify(null, data, 'test', input), errObj);
});
{
  const data = Buffer.from('Hello world');
  const keys = [['ec-key.pem', 64], ['dsa_private_1025.pem', 40]];
  for (const [file, length] of keys) {
    const privKey = fixtures.readKey(file);
    [
      crypto.createSign('sha1').update(data).sign(privKey),
      crypto.sign('sha1', data, privKey),
      crypto.sign('sha1', data, { key: privKey, dsaEncoding: 'der' }),
    ].forEach((sig) => {
      assert(sig.length >= length + 4 && sig.length <= length + 8);
      assert.strictEqual(
        crypto.createVerify('sha1').update(data).verify(privKey, sig),
        true
      );
      assert.strictEqual(crypto.verify('sha1', data, privKey, sig), true);
    });
    const opts = { key: privKey, dsaEncoding: 'ieee-p1363' };
    let sig = crypto.sign('sha1', data, opts);
    assert.strictEqual(sig.length, length);
    assert.strictEqual(crypto.verify('sha1', data, opts, sig), true);
    assert.strictEqual(crypto.createVerify('sha1')
                             .update(data)
                             .verify(opts, sig), true);
    for (const i of [-2, -1, 1, 2, 4, 8]) {
      sig = crypto.randomBytes(length + i);
      let result;
      try {
        result = crypto.verify('sha1', data, opts, sig);
      } catch (err) {
        assert.strictEqual(err.library, 'asn1 encoding routines');
        continue;
      }
      assert.strictEqual(result, false);
    }
  }
  const extSig = Buffer.from('494c18ab5c8a62a72aea5041966902bcfa229821af2bf65' +
                             '0b5b4870d1fe6aebeaed9460c62210693b5b0a300033823' +
                             '33d9529c8abd8c5948940af944828be16c', 'hex');
  for (const ok of [true, false]) {
    assert.strictEqual(
      crypto.verify('sha256', data, {
        key: fixtures.readKey('ec-key.pem'),
        dsaEncoding: 'ieee-p1363'
      }, extSig),
      ok
    );
    assert.strictEqual(
      crypto.createVerify('sha256').update(data).verify({
        key: fixtures.readKey('ec-key.pem'),
        dsaEncoding: 'ieee-p1363'
      }, extSig),
      ok
    );
    extSig[Math.floor(Math.random() * extSig.length)] ^= 1;
  }
  const sig = crypto.sign('sha1', data, {
    key: keyPem,
    dsaEncoding: 'ieee-p1363'
  });
  assert.strictEqual(crypto.verify('sha1', data, certPem, sig), true);
  assert.strictEqual(
    crypto.verify('sha1', data, {
      key: certPem,
      dsaEncoding: 'ieee-p1363'
    }, sig),
    true
  );
  assert.strictEqual(
    crypto.verify('sha1', data, {
      key: certPem,
      dsaEncoding: 'der'
    }, sig),
    true
  );
  for (const dsaEncoding of ['foo', null, {}, 5, true, NaN]) {
    assert.throws(() => {
      crypto.sign('sha1', data, {
        key: certPem,
        dsaEncoding
      });
    }, {
      code: 'ERR_INVALID_ARG_VALUE'
    });
  }
}
{
  if (!common.opensslCli)
    common.skip('node compiled without OpenSSL CLI.');
  const pubfile = fixtures.path('keys', 'rsa_public_2048.pem');
  const privkey = fixtures.readKey('rsa_private_2048.pem');
  const msg = 'Test123';
  const s5 = crypto.createSign('SHA256')
    .update(msg)
    .sign({
      key: privkey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING
    });
  tmpdir.refresh();
  const sigfile = path.join(tmpdir.path, 's5.sig');
  fs.writeFileSync(sigfile, s5);
  const msgfile = path.join(tmpdir.path, 's5.msg');
  fs.writeFileSync(msgfile, msg);
  const cmd =
    `"${common.opensslCli}" dgst -sha256 -verify "${pubfile}" -signature "${
      sigfile}" -sigopt rsa_padding_mode:pss -sigopt rsa_pss_saltlen:-2 "${
      msgfile}"`;
  exec(cmd, common.mustCall((err, stdout, stderr) => {
    assert(stdout.includes('Verified OK'));
  }));
}
{
  {
    const publicPem = fixtures.readKey('rsa_pss_public_2048.pem');
    const privatePem = fixtures.readKey('rsa_pss_private_2048.pem');
    const publicKey = crypto.createPublicKey(publicPem);
    const privateKey = crypto.createPrivateKey(privatePem);
    for (const key of [privatePem, privateKey]) {
      for (const algo of ['sha1', 'sha256']) {
        for (const saltLength of [undefined, 8, 10, 12, 16, 18, 20]) {
          const signature = crypto.sign(algo, 'foo', { key, saltLength });
          for (const pkey of [key, publicKey, publicPem]) {
            const okay = crypto.verify(
              algo,
              'foo',
              { key: pkey, saltLength },
              signature
            );
            assert.ok(okay);
          }
        }
      }
    }
  }
  {
    const publicPem =
      fixtures.readKey('rsa_pss_public_2048_sha256_sha256_16.pem');
    const privatePem =
      fixtures.readKey('rsa_pss_private_2048_sha256_sha256_16.pem');
    const publicKey = crypto.createPublicKey(publicPem);
    const privateKey = crypto.createPrivateKey(privatePem);
    for (const key of [privatePem, privateKey]) {
      assert.throws(() => {
        crypto.sign('sha1', 'foo', key);
      for (const saltLength of [8, 10, 12]) {
        assert.throws(() => {
          crypto.sign('sha256', 'foo', { key, saltLength });
      }
      for (const saltLength of [undefined, 16, 18, 20]) {
        const signature = crypto.sign('sha256', 'foo', { key, saltLength });
        for (const pkey of [key, publicKey, publicPem]) {
          const okay = crypto.verify(
            'sha256',
            'foo',
            { key: pkey, saltLength },
            signature
          );
          assert.ok(okay);
        }
      }
    }
  }
  {
    const publicPem =
      fixtures.readKey('rsa_pss_public_2048_sha512_sha256_20.pem');
    const privatePem =
      fixtures.readKey('rsa_pss_private_2048_sha512_sha256_20.pem');
    const publicKey = crypto.createPublicKey(publicPem);
    const privateKey = crypto.createPrivateKey(privatePem);
    for (const key of [privatePem, privateKey]) {
      for (const algo of ['sha1', 'sha256']) {
        assert.throws(() => {
          crypto.sign(algo, 'foo', key);
      }
      const signature = crypto.sign('sha512', 'foo', key);
      for (const pkey of [key, publicKey, publicPem]) {
        const okay = crypto.verify('sha512', 'foo', pkey, signature);
        assert.ok(okay);
      }
    }
  }
}
