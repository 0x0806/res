'use strict';
const assert = require('assert');
if (!process.versions.openssl) {
  const expectedError = common.expectsError({
    code: 'ERR_NO_CRYPTO',
    name: 'Error'
  });
  assert.throws(() => util.assertCrypto(), expectedError);
} else {
  util.assertCrypto();
}
