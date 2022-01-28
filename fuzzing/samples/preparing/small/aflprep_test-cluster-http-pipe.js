'use strict';
if (common.isWindows) {
  common.skip(
    'It is not possible to send pipe handles over the IPC pipe on Windows');
}
const assert = require('assert');
const cluster = require('cluster');
const http = require('http');
if (cluster.isPrimary) {
  tmpdir.refresh();
  const worker = cluster.fork();
  worker.on('message', common.mustCall((msg) => {
    assert.strictEqual(msg, 'DONE');
  }));
  worker.on('exit', common.mustCall());
  return;
}
http.createServer(common.mustCall((req, res) => {
  assert.strictEqual(req.connection.remoteAddress, undefined);
  assert.strictEqual(req.connection.localAddress, undefined);
  res.writeHead(200);
  res.end('OK');
})).listen(common.PIPE, common.mustCall(() => {
    res.resume();
    res.on('end', common.mustSucceed(() => {
      process.send('DONE');
      process.exit();
    }));
  }));
}));
