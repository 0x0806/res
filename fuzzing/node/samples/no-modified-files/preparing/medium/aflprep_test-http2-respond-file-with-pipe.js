'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (common.isWindows)
  common.skip('no mkfifo on Windows');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const http2 = require('http2');
const assert = require('assert');
tmpdir.refresh();
const pipeName = path.join(tmpdir.path, 'pipe');
const mkfifo = child_process.spawnSync('mkfifo', [ pipeName ]);
if (mkfifo.error && mkfifo.error.code === 'ENOENT') {
  common.skip('missing mkfifo');
}
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFile(pipeName, {
  }, {
    onError: common.mustNotCall(),
    statCheck: common.mustCall()
  });
});
server.listen(0, () => {
  const req = client.request();
  req.on('response', common.mustCall((headers) => {
    assert.strictEqual(headers[':status'], 200);
  }));
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => body += chunk);
  req.on('end', common.mustCall(() => {
    assert.strictEqual(body, 'Hello, world!\n');
    client.close();
    server.close();
  }));
  req.end();
});
fs.open(pipeName, 'w', common.mustSucceed((fd) => {
  fs.writeSync(fd, 'Hello, world!\n');
  fs.closeSync(fd);
}));
