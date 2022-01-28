'use strict';
const assert = require('assert');
const http = require('http');
const url = require('url');
const body1_s = '1111111111111111';
const body2_s = '22222';
const body3_s = '3333333333333333333';
const server = http.createServer(function(req, res) {
  const pathname = url.parse(req.url).pathname;
  let body;
  switch (pathname) {
    default: body = body3_s;
  }
  res.writeHead(200, {
    'Content-Length': body.length
  });
  res.end(body);
});
server.listen(0);
let body1 = '';
let body2 = '';
let body3 = '';
server.on('listening', function() {
  req1.on('response', function(res1) {
    res1.setEncoding('utf8');
    res1.on('data', function(chunk) {
      body1 += chunk;
    });
    res1.on('end', function() {
      setTimeout(function() {
        req2.on('response', function(res2) {
          res2.setEncoding('utf8');
          res2.on('data', function(chunk) { body2 += chunk; });
          res2.on('end', function() {
            req3.on('response', function(res3) {
              res3.setEncoding('utf8');
              res3.on('data', function(chunk) { body3 += chunk; });
              res3.on('end', function() { server.close(); });
            });
          });
        });
      }, 500);
    });
  });
});
process.on('exit', function() {
  assert.strictEqual(body1_s, body1);
  assert.strictEqual(body2_s, body2);
  assert.strictEqual(body3_s, body3);
});
