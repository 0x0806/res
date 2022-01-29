'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const spawn = require('child_process').spawn;
const defaultCoreList = require('crypto').constants.defaultCoreCipherList;
function doCheck(arg, expression, check) {
  let out = '';
  arg = arg.concat([
    '-pe',
    expression,
  ]);
  spawn(process.execPath, arg, {})
    .on('error', common.mustNotCall())
    .stdout.on('data', function(chunk) {
      out += chunk;
    }).on('end', function() {
      assert.strictEqual(out.trim(), check);
    }).on('error', common.mustNotCall());
}
doCheck([], 'crypto.constants.defaultCipherList', defaultCoreList);
doCheck([], 'tls.DEFAULT_CIPHERS', defaultCoreList);
doCheck(['--tls-cipher-list=ABC'], 'crypto.constants.defaultCipherList', 'ABC');
doCheck(['--tls-cipher-list=ABC'], 'tls.DEFAULT_CIPHERS', 'ABC');
