'use strict';
const assert = require('assert');
const http = require('http');
const url = require('url');
const body1_s = '1111111111111111';
const body2_s = '22222';
const server = http.createServer(function(req, res) {
  res.writeHead(200, {
    'Content-Length': body.length
  });
  res.end(body);
});
server.listen(0);
let body1 = '';
let body2 = '';
server.on('listening', function() {
  req1.end();
  req1.on('response', function(res1) {
    res1.setEncoding('utf8');
    res1.on('data', function(chunk) {
      body1 += chunk;
    });
    res1.on('end', function() {
      req2.end();
      req2.on('response', function(res2) {
        res2.setEncoding('utf8');
        res2.on('data', function(chunk) { body2 += chunk; });
        res2.on('end', function() { server.close(); });
      });
    });
  });
});
process.on('exit', function() {
  assert.strictEqual(body1_s, body1);
  assert.strictEqual(body2_s, body2);
});
