'use strict';
if (common.isWindows)
  common.skip('This test is disabled on windows.');
const assert = require('assert');
const http = require('http');
const net = require('net');
switch (process.argv[2]) {
  case 'child': return child();
}
let ok;
process.on('exit', function() {
  assert.ok(ok);
});
test(function(child, port) {
  http.get({
    server: 'localhost',
    port: port,
  }).on('response', function(res) {
    let s = '';
    res.on('data', function(c) {
      s += c.toString();
    });
    res.on('end', function() {
      child.kill();
      child.on('exit', function() {
        assert.strictEqual(s, 'hello from child\n');
        assert.strictEqual(res.statusCode, 200);
        console.log('ok');
        ok = true;
      });
    });
  });
});
function child() {
  process.on('disconnect', function() {
    console.error('exit on disconnect');
    process.exit(0);
  });
  http.createServer(function(req, res) {
    console.error('request on child');
    console.error('%s %s', req.method, req.url, req.headers);
    res.end('hello from child\n');
  }).listen({ fd: 3 }, function() {
    console.error('child listening on fd=3');
    process.send('listening');
  });
}
function test(cb) {
  const server = net.createServer(function(conn) {
    console.error('connection on parent');
    conn.end('hello from parent\n');
  }).listen(0, function() {
    const port = this.address().port;
    console.error('server listening on %d', port);
    const spawn = require('child_process').spawn;
    const child = spawn(process.execPath, [__filename, 'child'], {
      stdio: [ 0, 1, 2, server._handle, 'ipc' ]
    });
    console.log('%j\n', { pid: child.pid });
    server.close();
    child.on('message', function(msg) {
      if (msg === 'listening') {
        cb(child, port);
      }
    });
  });
}
