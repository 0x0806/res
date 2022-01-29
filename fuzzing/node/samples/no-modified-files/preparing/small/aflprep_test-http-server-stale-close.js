'use strict';
const http = require('http');
const fork = require('child_process').fork;
const assert = require('assert');
if (process.env.NODE_TEST_FORK_PORT) {
  const req = http.request({
    headers: { 'Content-Length': '42' },
    method: 'POST',
    host: '127.0.0.1',
    port: +process.env.NODE_TEST_FORK_PORT,
  }, process.exit);
  req.write('BAM');
  req.end();
} else {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Length': '42' });
    req.pipe(res);
    assert.strictEqual(req.destroyed, false);
    req.on('close', () => {
      assert.strictEqual(req.destroyed, true);
      server.close();
      res.end();
    });
  });
  server.listen(0, function() {
    fork(__filename, {
      env: { ...process.env, NODE_TEST_FORK_PORT: this.address().port }
    });
  });
}
