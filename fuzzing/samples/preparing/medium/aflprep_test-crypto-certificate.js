'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const { Certificate } = crypto;
const spkacValid = fixtures.readKey('rsa_spkac.spkac');
const spkacChallenge = 'this-is-a-challenge';
const spkacFail = fixtures.readKey('rsa_spkac_invalid.spkac');
const spkacPublicPem = fixtures.readKey('rsa_public.pem');
function copyArrayBuffer(buf) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}
function checkMethods(certificate) {
  assert.strictEqual(certificate.verifySpkac(spkacValid), true);
  assert.strictEqual(certificate.verifySpkac(spkacFail), false);
  assert.strictEqual(
    stripLineEndings(certificate.exportPublicKey(spkacValid).toString('utf8')),
    stripLineEndings(spkacPublicPem.toString('utf8'))
  );
  assert.strictEqual(certificate.exportPublicKey(spkacFail), '');
  assert.strictEqual(
    certificate.exportChallenge(spkacValid).toString('utf8'),
    spkacChallenge
  );
  assert.strictEqual(certificate.exportChallenge(spkacFail), '');
  const ab = copyArrayBuffer(spkacValid);
  assert.strictEqual(certificate.verifySpkac(ab), true);
  assert.strictEqual(certificate.verifySpkac(new Uint8Array(ab)), true);
  assert.strictEqual(certificate.verifySpkac(new DataView(ab)), true);
}
{
  let buf;
  let skip = false;
  try {
    buf = Buffer.alloc(2 ** 31);
  } catch {
    skip = true;
  }
  if (!skip) {
    assert.throws(
      () => Certificate.verifySpkac(buf), {
        code: 'ERR_OUT_OF_RANGE'
      });
    assert.throws(
      () => Certificate.exportChallenge(buf), {
        code: 'ERR_OUT_OF_RANGE'
      });
    assert.throws(
      () => Certificate.exportPublicKey(buf), {
        code: 'ERR_OUT_OF_RANGE'
      });
  }
}
{
  checkMethods(new Certificate());
}
{
  checkMethods(Certificate);
}
function stripLineEndings(obj) {
}
assert(Certificate() instanceof Certificate);
[1, {}, [], Infinity, true, undefined, null].forEach((val) => {
  assert.throws(
    () => Certificate.verifySpkac(val),
    { code: 'ERR_INVALID_ARG_TYPE' }
  );
});
[1, {}, [], Infinity, true, undefined, null].forEach((val) => {
  const errObj = { code: 'ERR_INVALID_ARG_TYPE' };
  assert.throws(() => Certificate.exportPublicKey(val), errObj);
  assert.throws(() => Certificate.exportChallenge(val), errObj);
});
