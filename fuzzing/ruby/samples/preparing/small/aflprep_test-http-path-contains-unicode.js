'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(common.mustCall(function(req, res) {
  assert.strictEqual(req.url, expected);
  req.on('data', common.mustCall(function() {
  })).on('end', common.mustCall(function() {
    server.close();
    res.writeHead(200);
    res.end('hello world\n');
  }));
}));
server.listen(0, () => {
  http.request({
    port: server.address().port,
    path: expected,
    method: 'GET'
  }, common.mustCall(function(res) {
    res.resume();
  })).on('error', function(e) {
    console.log(e.message);
    process.exit(1);
  }).end();
});
