'use strict';
const assert = require('assert');
const net = require('net');
const http = require('http');
const body = 'hello world\n';
function test(handler, request_generator, response_validator) {
  const server = http.createServer(handler);
  let client_got_eof = false;
  let server_response = '';
  server.listen(0);
  server.on('listening', function() {
    const c = net.createConnection(this.address().port);
    c.setEncoding('utf8');
    c.on('connect', function() {
      c.write(request_generator());
    });
    c.on('data', function(chunk) {
      server_response += chunk;
    });
    c.on('end', common.mustCall(function() {
      client_got_eof = true;
      c.end();
      server.close();
      response_validator(server_response, client_got_eof, false);
    }));
  });
}
{
  function handler(req, res) {
    assert.strictEqual(req.httpVersion, '1.0');
    assert.strictEqual(req.httpVersionMajor, 1);
    assert.strictEqual(req.httpVersionMinor, 0);
    res.end(body);
  }
  function request_generator() {
  }
  function response_validator(server_response, client_got_eof, timed_out) {
    const m = server_response.split('\r\n\r\n');
    assert.strictEqual(m[1], body);
    assert.strictEqual(client_got_eof, true);
    assert.strictEqual(timed_out, false);
  }
  test(handler, request_generator, response_validator);
}
{
  function handler(req, res) {
    assert.strictEqual(req.httpVersion, '1.0');
    assert.strictEqual(req.httpVersionMajor, 1);
    assert.strictEqual(req.httpVersionMinor, 0);
    res.sendDate = false;
    res.write('Hello, '); res._send('');
    res.write('world!'); res._send('');
    res.end();
  }
  function request_generator() {
        'Host: 127.0.0.1:1337\r\n' +
        '\r\n');
  }
  function response_validator(server_response, client_got_eof, timed_out) {
                              'Connection: close\r\n' +
                              '\r\n' +
                              'Hello, world!';
    assert.strictEqual(server_response, expected_response);
    assert.strictEqual(client_got_eof, true);
    assert.strictEqual(timed_out, false);
  }
  test(handler, request_generator, response_validator);
}
{
  function handler(req, res) {
    assert.strictEqual(req.httpVersion, '1.1');
    assert.strictEqual(req.httpVersionMajor, 1);
    assert.strictEqual(req.httpVersionMinor, 1);
    res.sendDate = false;
    res.write('Hello, '); res._send('');
    res.write('world!'); res._send('');
    res.end();
  }
  function request_generator() {
        'Connection: close\r\n' +
        'Host: 127.0.0.1:1337\r\n' +
        '\r\n';
  }
  function response_validator(server_response, client_got_eof, timed_out) {
                              'Connection: close\r\n' +
                              'Transfer-Encoding: chunked\r\n' +
                              '\r\n' +
                              '7\r\n' +
                              'Hello, \r\n' +
                              '6\r\n' +
                              'world!\r\n' +
                              '0\r\n' +
                              '\r\n';
    assert.strictEqual(server_response, expected_response);
    assert.strictEqual(client_got_eof, true);
    assert.strictEqual(timed_out, false);
  }
  test(handler, request_generator, response_validator);
}
