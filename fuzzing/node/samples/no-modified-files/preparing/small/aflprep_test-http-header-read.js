'use strict';
const assert = require('assert');
const http = require('http');
const s = http.createServer(function(req, res) {
  const contentType = 'Content-Type';
  res.setHeader(contentType, plain);
  assert.ok(!res.headersSent);
  res.writeHead(200);
  assert.ok(res.headersSent);
  res.end('hello world\n');
  assert.strictEqual(plain, res.getHeader(contentType));
});
s.listen(0, runTest);
function runTest() {
  http.get({ port: this.address().port }, function(response) {
    response.on('end', function() {
      s.close();
    });
    response.resume();
  });
}
