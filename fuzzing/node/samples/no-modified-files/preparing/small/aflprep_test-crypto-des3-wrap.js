'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const test = {
  key: Buffer.from('3c08e25be22352910671cfe4ba3652b1220a8a7769b490ba', 'hex'),
  iv: Buffer.alloc(0),
  plaintext: '32|RmVZZkFUVmpRRkp0TmJaUm56ZU9qcnJkaXNNWVNpTTU*|iXmckfRWZBG' +
    'JjAfaFg**'
};
const cipher = crypto.createCipheriv('des3-wrap', test.key, test.iv);
const ciphertext = cipher.update(test.plaintext, 'utf8');
const decipher = crypto.createDecipheriv('des3-wrap', test.key, test.iv);
const msg = decipher.update(ciphertext, 'buffer', 'utf8');
assert.strictEqual(msg, test.plaintext);
