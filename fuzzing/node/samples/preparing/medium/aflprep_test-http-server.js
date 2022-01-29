'use strict';
const assert = require('assert');
const net = require('net');
const http = require('http');
const url = require('url');
const qs = require('querystring');
const invalid_options = [ 'foo', 42, true ];
invalid_options.forEach((option) => {
  assert.throws(() => {
    new http.Server(option);
  }, {
    code: 'ERR_INVALID_ARG_TYPE'
  });
});
let request_number = 0;
let requests_sent = 0;
let server_response = '';
let client_got_eof = false;
const server = http.createServer(function(req, res) {
  res.id = request_number;
  req.id = request_number++;
  assert.strictEqual(res.req, req);
  if (req.id === 0) {
    assert.strictEqual(req.method, 'GET');
    assert.strictEqual(qs.parse(url.parse(req.url).query).hello, 'world');
    assert.strictEqual(qs.parse(url.parse(req.url).query).foo, 'b==ar');
  }
  if (req.id === 1) {
    assert.strictEqual(req.method, 'POST');
  }
  if (req.id === 2) {
    assert.strictEqual(req.headers['x-x'], 'foo');
  }
  if (req.id === 3) {
    assert.strictEqual(req.headers['x-x'], 'bar');
    this.close();
  }
  setTimeout(function() {
    res.write(url.parse(req.url).pathname);
    res.end();
  }, 1);
});
server.listen(0);
server.httpAllowHalfOpen = true;
server.on('listening', function() {
  const c = net.createConnection(this.address().port);
  c.setEncoding('utf8');
  c.on('connect', function() {
    requests_sent += 1;
  });
  c.on('data', function(chunk) {
    server_response += chunk;
    if (requests_sent === 1) {
      requests_sent += 1;
    }
    if (requests_sent === 2) {
      c.end();
      assert.strictEqual(c.readyState, 'readOnly');
      requests_sent += 2;
    }
  });
  c.on('end', function() {
    client_got_eof = true;
  });
  c.on('close', function() {
    assert.strictEqual(c.readyState, 'closed');
  });
});
process.on('exit', function() {
  assert.strictEqual(request_number, 4);
  assert.strictEqual(requests_sent, 4);
  assert.match(server_response, hello);
  assert.match(server_response, quit);
  assert.strictEqual(client_got_eof, true);
});
