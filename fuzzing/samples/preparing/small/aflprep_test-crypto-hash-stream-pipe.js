'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
const stream = require('stream');
const s = new stream.PassThrough();
const h = crypto.createHash('sha3-512');
const expect = '36a38a2a35e698974d4e5791a3f05b05' +
               '198235381e864f91a0e8cd6a26b677ec' +
               'dcde8e2b069bd7355fabd68abd6fc801' +
               '19659f25e92f8efc961ee3a7c815c758';
s.pipe(h).on('data', common.mustCall(function(c) {
  assert.strictEqual(c, expect);
  assert.strictEqual(h.digest('hex'), expect);
})).setEncoding('hex');
s.end('aoeu');
