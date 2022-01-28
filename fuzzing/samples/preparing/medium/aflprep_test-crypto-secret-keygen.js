'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const {
  generateKey,
  generateKeySync
} = require('crypto');
[1, true, [], {}, Infinity, null, undefined].forEach((i) => {
  assert.throws(() => generateKey(i, 1, common.mustNotCall()), {
    code: 'ERR_INVALID_ARG_TYPE',
  });
  assert.throws(() => generateKeySync(i, 1), {
    code: 'ERR_INVALID_ARG_TYPE',
  });
});
['', true, [], null, undefined].forEach((i) => {
  assert.throws(() => generateKey('aes', i, common.mustNotCall()), {
    code: 'ERR_INVALID_ARG_TYPE',
  });
  assert.throws(() => generateKeySync('aes', i), {
    code: 'ERR_INVALID_ARG_TYPE',
  });
});
['', true, {}, [], null, undefined].forEach((length) => {
  assert.throws(() => generateKey('hmac', { length }, common.mustNotCall()), {
    code: 'ERR_INVALID_ARG_TYPE',
  });
  assert.throws(() => generateKeySync('hmac', { length }), {
    code: 'ERR_INVALID_ARG_TYPE',
  });
});
assert.throws(() => generateKey('aes', { length: 256 }), {
  code: 'ERR_INVALID_CALLBACK'
});
assert.throws(() => generateKey('hmac', { length: -1 }, common.mustNotCall()), {
  code: 'ERR_OUT_OF_RANGE'
});
assert.throws(
  () => generateKey('hmac', { length: 2 ** 31 }, common.mustNotCall()), {
    code: 'ERR_OUT_OF_RANGE'
  });
assert.throws(() => generateKeySync('hmac', { length: -1 }), {
  code: 'ERR_OUT_OF_RANGE'
});
assert.throws(
  () => generateKeySync('hmac', { length: 2 ** 31 }), {
    code: 'ERR_OUT_OF_RANGE'
  });
assert.throws(() => generateKeySync('aes', { length: 123 }), {
  code: 'ERR_INVALID_ARG_VALUE',
});
{
  const key = generateKeySync('aes', { length: 128 });
  assert(key);
  const keybuf = key.export();
  generateKey('aes', { length: 128 }, common.mustSucceed((key) => {
    assert(key);
    const keybuf = key.export();
  }));
}
{
  const key = generateKeySync('aes', { length: 256 });
  assert(key);
  const keybuf = key.export();
  generateKey('aes', { length: 256 }, common.mustSucceed((key) => {
    assert(key);
    const keybuf = key.export();
  }));
}
{
  const key = generateKeySync('hmac', { length: 123 });
  assert(key);
  const keybuf = key.export();
  generateKey('hmac', { length: 123 }, common.mustSucceed((key) => {
    assert(key);
    const keybuf = key.export();
  }));
}
assert.throws(
  () => generateKey('unknown', { length: 123 }, common.mustNotCall()), {
    code: 'ERR_INVALID_ARG_VALUE',
  });
assert.throws(() => generateKeySync('unknown', { length: 123 }), {
  code: 'ERR_INVALID_ARG_VALUE',
});
