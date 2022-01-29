'use strict';
const assert = require('assert');
const fs = require('fs');
const http = require('http');
const path = require('path');
tmpdir.refresh();
const filename = path.join(tmpdir.path, 'big');
let count = 0;
const server = http.createServer((req, res) => {
  let timeoutId;
  assert.strictEqual(req.method, 'POST');
  req.pause();
  setTimeout(() => {
    req.resume();
  }, 1000);
  req.on('data', (chunk) => {
    count += chunk.length;
  });
  req.on('end', () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    res.end();
  });
});
server.listen(0);
server.on('listening', () => {
  common.createZeroFilledFile(filename);
  makeRequest();
});
function makeRequest() {
  const req = http.request({
    port: server.address().port,
    method: 'POST'
  });
  const s = fs.ReadStream(filename);
  s.pipe(req);
  s.on('close', common.mustSucceed());
  req.on('response', (res) => {
    res.resume();
    res.on('end', () => {
      server.close();
    });
  });
}
process.on('exit', () => {
  assert.strictEqual(count, 1024 * 10240);
});
