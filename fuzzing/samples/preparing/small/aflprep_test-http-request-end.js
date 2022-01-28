'use strict';
const assert = require('assert');
const http = require('http');
const expected = 'Post Body For Test';
const server = http.Server(function(req, res) {
  let result = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    result += chunk;
  });
  req.on('end', function() {
    assert.strictEqual(result, expected);
    server.close();
    res.writeHead(200);
    res.end('hello world\n');
  });
});
server.listen(0, function() {
  const req = http.request({
    port: this.address().port,
    method: 'POST'
  }, function(res) {
    console.log(res.statusCode);
    res.resume();
  }).on('error', function(e) {
    console.log(e.message);
    process.exit(1);
  });
  const result = req.end(expected);
  assert.strictEqual(req, result);
});
