'use strict';
const assert = require('assert');
const { fork, spawn } = require('child_process');
const net = require('net');
if (process.argv[2] !== 'child') {
  tmpdir.refresh();
  const child = fork(__filename, ['child'], { stdio: 'inherit' });
  child.on('exit', common.mustCall(function(code) {
    assert.strictEqual(code, 0);
  }));
  return;
}
const server = net.createServer((conn) => {
  spawn(process.execPath, ['-v'], {
    stdio: ['ignore', conn, 'ignore']
  }).on('close', common.mustCall(() => {
    conn.end();
  }));
}).listen(common.PIPE, () => {
  const client = net.connect(common.PIPE, common.mustCall());
  client.once('data', () => {
    client.end(() => {
      server.close();
    });
  });
});
