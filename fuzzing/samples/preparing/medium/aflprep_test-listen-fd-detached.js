'use strict';
if (common.isWindows)
  common.skip('This test is disabled on windows.');
const assert = require('assert');
const http = require('http');
const net = require('net');
const spawn = require('child_process').spawn;
switch (process.argv[2]) {
  case 'child': return child();
  case 'parent': return parent();
  default: return test();
}
function test() {
  const parent = spawn(process.execPath, [__filename, 'parent'], {
    stdio: [ 0, 'pipe', 2 ]
  });
  let json = '';
  parent.stdout.on('data', function(c) {
    json += c.toString();
    if (json.includes('\n')) next();
  });
  function next() {
    console.error('output from parent = %s', json);
    const child = JSON.parse(json);
    http.get({
      server: 'localhost',
      port: child.port,
    }).on('response', function(res) {
      let s = '';
      res.on('data', function(c) {
        s += c.toString();
      });
      res.on('end', function() {
        process.kill(child.pid, 'SIGKILL');
        try {
          parent.kill();
        } catch {}
        assert.strictEqual(s, 'hello from child\n');
        assert.strictEqual(res.statusCode, 200);
      });
    });
  }
}
function parent() {
  const server = net.createServer(function(conn) {
    console.error('connection on parent');
    conn.end('hello from parent\n');
  }).listen(0, function() {
    console.error('server listening on %d', this.address().port);
    const child = spawn(process.execPath, [__filename, 'child'], {
      stdio: [ 'ignore', 'ignore', 'ignore', server._handle ],
      detached: true
    });
    console.log('%j\n', { pid: child.pid, port: this.address().port });
    server.close();
    child.unref();
  });
}
function child() {
  http.createServer(function(req, res) {
    console.error('request on child');
    console.error('%s %s', req.method, req.url, req.headers);
    res.end('hello from child\n');
  }).listen({ fd: 3 }, function() {
    console.error('child listening on fd=3');
  });
}
