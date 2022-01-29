'use strict';
const assert = require('assert');
const http = require('http');
const url = require('url');
const cookies = [
];
                  'set-cookie': cookies,
                  'hello': 'world' };
const backend = http.createServer(function(req, res) {
  console.error('backend request');
  res.writeHead(200, headers);
  res.write('hello world\n');
  res.end();
});
const proxy = http.createServer(function(req, res) {
  console.error(`proxy req headers: ${JSON.stringify(req.headers)}`);
  http.get({
    port: backend.address().port,
    path: url.parse(req.url).pathname
  }, function(proxy_res) {
    console.error(`proxy res headers: ${JSON.stringify(proxy_res.headers)}`);
    assert.strictEqual(proxy_res.headers.hello, 'world');
    assert.deepStrictEqual(proxy_res.headers['set-cookie'], cookies);
    res.writeHead(proxy_res.statusCode, proxy_res.headers);
    proxy_res.on('data', function(chunk) {
      res.write(chunk);
    });
    proxy_res.on('end', function() {
      res.end();
      console.error('proxy res');
    });
  });
});
let body = '';
let nlistening = 0;
function startReq() {
  nlistening++;
  if (nlistening < 2) return;
  http.get({
    port: proxy.address().port,
  }, function(res) {
    console.error('got res');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers.hello, 'world');
    assert.deepStrictEqual(res.headers['set-cookie'], cookies);
    res.setEncoding('utf8');
    res.on('data', function(chunk) { body += chunk; });
    res.on('end', function() {
      proxy.close();
      backend.close();
      console.error('closed both');
    });
  });
  console.error('client req');
}
console.error('listen proxy');
proxy.listen(0, startReq);
console.error('listen backend');
backend.listen(0, startReq);
process.on('exit', function() {
  assert.strictEqual(body, 'hello world\n');
});
