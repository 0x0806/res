'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const fork = require('child_process').fork;
const tls = require('tls');
if (process.env.CHILD) {
  return tls.createServer({});
}
const env = {
  ...process.env,
  CHILD: 'yes',
};
const opts = {
  env: env,
  silent: true,
};
let stderr = '';
fork(__filename, opts)
  .on('exit', common.mustCall(function(status) {
    assert.strictEqual(status, 0);
  }))
  .on('close', common.mustCall(function() {
    if (!common.isWindows) {
      assert.match(stderr, re);
    }
  }))
  .stderr.setEncoding('utf8').on('data', function(str) {
    stderr += str;
  });
