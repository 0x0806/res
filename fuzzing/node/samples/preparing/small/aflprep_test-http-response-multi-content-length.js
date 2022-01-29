'use strict';
const http = require('http');
const assert = require('assert');
function test(server) {
  server.listen(0, common.mustCall(() => {
    http.get(
      { port: server.address().port },
      () => { assert.fail('Client allowed multiple content-length headers.'); }
    ).on('error', common.mustCall((err) => {
      assert.ok(err.message.startsWith('Parse Error'), err.message);
      assert.strictEqual(err.code, 'HPE_UNEXPECTED_CONTENT_LENGTH');
      server.close();
    }));
  }));
}
{
  const server = http.createServer((req, res) => {
    res.setHeader('content-length', [2, 1]);
    res.end('ok');
  });
  test(server);
}
{
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'content-length': [1, 2] });
    res.end('ok');
  });
  test(server);
}
