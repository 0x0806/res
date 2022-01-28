'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const net = require('net');
const { fork } = require('child_process');
if (process.argv[2] !== 'child') {
  tmpdir.refresh();
  const child = fork(__filename, ['child'], { stdio: 'inherit' });
  child.on('exit', common.mustCall(function(code) {
    assert.strictEqual(code, 0);
  }));
  return;
}
const server = net.createServer((c) => {
  c.end();
}).listen(common.PIPE, common.mustCall(() => {
  let errored = false;
  tls.connect({ path: common.PIPE })
    .once('error', common.mustCall((e) => {
      assert.strictEqual(e.code, 'ECONNRESET');
      assert.strictEqual(e.path, common.PIPE);
      assert.strictEqual(e.port, undefined);
      assert.strictEqual(e.host, undefined);
      assert.strictEqual(e.localAddress, undefined);
      server.close();
      errored = true;
    }))
    .on('close', common.mustCall(() => {
      assert.strictEqual(errored, true);
    }));
}));
