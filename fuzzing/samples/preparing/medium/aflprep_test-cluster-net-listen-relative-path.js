'use strict';
if (common.isWindows)
  common.skip('On Windows named pipes live in their own ' +
              'filesystem and don\'t have a ~100 byte limit');
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
const assert = require('assert');
const cluster = require('cluster');
const fs = require('fs');
const net = require('net');
const path = require('path');
const socketName = 'A'.repeat(101 - socketDir.length);
assert.ok(path.resolve(socketDir, socketName).length > 100,
          'absolute socket path should be longer than 100 bytes');
if (cluster.isPrimary) {
  tmpdir.refresh();
  process.chdir(tmpdir.path);
  fs.mkdirSync(socketDir);
  cluster.fork().on('exit', common.mustCall((statusCode) => {
    assert.strictEqual(statusCode, 0);
    assert.ok(!fs.existsSync(path.join(socketDir, socketName)),
              'Socket should be removed when the worker exits');
  }));
} else {
  process.chdir(socketDir);
  const server = net.createServer(common.mustNotCall());
  server.listen(socketName, common.mustCall(() => {
    assert.ok(fs.existsSync(socketName), 'Socket created in CWD');
    process.disconnect();
  }));
}
