'use strict';
if (!common.hasCrypto)
  common.skip('node compiled without OpenSSL.');
const crypto = require('crypto');
common.allowGlobals(require('domain'));
global.domain = require('domain');
crypto.randomBytes(8);
crypto.randomBytes(8, common.mustSucceed());
const buf = Buffer.alloc(8);
crypto.randomFillSync(buf);
crypto.pseudoRandomBytes(8);
crypto.pseudoRandomBytes(8, common.mustSucceed());
crypto.pbkdf2('password', 'salt', 8, 8, 'sha1', common.mustSucceed());
