'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer(function(req, res) {
  assert.strictEqual(req.headers.accept, 'abc, def, ghijklmnopqrst');
  assert.strictEqual(req.headers.host, 'foo');
  assert.strictEqual(req.headers['www-authenticate'], 'foo, bar, baz');
  assert.strictEqual(req.headers['proxy-authenticate'], 'foo, bar, baz');
  assert.strictEqual(req.headers['x-foo'], 'bingo');
  assert.strictEqual(req.headers['x-bar'], 'banjo, bango');
  assert.strictEqual(req.headers['sec-websocket-protocol'], 'chat, share');
  assert.strictEqual(req.headers['sec-websocket-extensions'],
                     'foo; 1, bar; 2, baz');
  assert.strictEqual(req.headers.constructor, 'foo, bar, baz');
  res.end('EOF');
  server.close();
});
server.listen(0, function() {
  http.get({
    host: 'localhost',
    port: this.address().port,
    headers: [
      ['accept', 'abc'],
      ['accept', 'def'],
      ['Accept', 'ghijklmnopqrst'],
      ['host', 'foo'],
      ['Host', 'bar'],
      ['hOst', 'baz'],
      ['www-authenticate', 'foo'],
      ['WWW-Authenticate', 'bar'],
      ['WWW-AUTHENTICATE', 'baz'],
      ['proxy-authenticate', 'foo'],
      ['Proxy-Authenticate', 'bar'],
      ['PROXY-AUTHENTICATE', 'baz'],
      ['x-foo', 'bingo'],
      ['x-bar', 'banjo'],
      ['x-bar', 'bango'],
      ['sec-websocket-protocol', 'chat'],
      ['sec-websocket-protocol', 'share'],
      ['sec-websocket-extensions', 'foo; 1'],
      ['sec-websocket-extensions', 'bar; 2'],
      ['sec-websocket-extensions', 'baz'],
      ['constructor', 'foo'],
      ['constructor', 'bar'],
      ['constructor', 'baz'],
    ]
  });
});
