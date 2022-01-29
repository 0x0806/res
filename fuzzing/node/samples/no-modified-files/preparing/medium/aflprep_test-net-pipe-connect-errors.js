'use strict';
const fs = require('fs');
const net = require('net');
const assert = require('assert');
let emptyTxt;
if (common.isWindows) {
  emptyTxt = fixtures.path('empty.txt');
} else {
  tmpdir.refresh();
  emptyTxt = `${tmpdir.path}0.txt`;
  function cleanup() {
    try {
      fs.unlinkSync(emptyTxt);
    } catch (e) {
      assert.strictEqual(e.code, 'ENOENT');
    }
  }
  process.on('exit', cleanup);
  cleanup();
  fs.writeFileSync(emptyTxt, '');
}
const notSocketClient = net.createConnection(emptyTxt, function() {
  assert.fail('connection callback should not run');
});
notSocketClient.on('error', common.mustCall(function(err) {
  assert(err.code === 'ENOTSOCK' || err.code === 'ECONNREFUSED',
         `received ${err.code} instead of ENOTSOCK or ECONNREFUSED`);
}));
const noEntSocketClient = net.createConnection('no-ent-file', function() {
  assert.fail('connection to non-existent socket, callback should not run');
});
noEntSocketClient.on('error', common.mustCall(function(err) {
  assert.strictEqual(err.code, 'ENOENT');
}));
if (!common.isWindows && !common.isIBMi && process.getuid() !== 0) {
  const accessServer = net.createServer(
    common.mustNotCall('server callback should not run'));
  accessServer.listen(common.PIPE, common.mustCall(function() {
    fs.chmodSync(common.PIPE, 0);
    const accessClient = net.createConnection(common.PIPE, function() {
      assert.fail('connection should get EACCES, callback should not run');
    });
    accessClient.on('error', common.mustCall(function(err) {
      assert.strictEqual(err.code, 'EACCES');
      accessServer.close();
    }));
  }));
}
