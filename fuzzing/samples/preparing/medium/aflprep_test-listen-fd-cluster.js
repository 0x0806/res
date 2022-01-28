'use strict';
if (common.isWindows)
  common.skip('This test is disabled on windows.');
const assert = require('assert');
const http = require('http');
const net = require('net');
const cluster = require('cluster');
console.error('Cluster listen fd test', process.argv[2] || 'runner');
switch (process.argv[2]) {
  case 'primary': return primary();
  case 'worker': return worker();
}
let ok;
process.on('exit', function() {
  assert.ok(ok);
});
test(function(parent, port) {
  http.get({
    server: 'localhost',
    port: port,
  }).on('response', function(res) {
    let s = '';
    res.on('data', function(c) {
      s += c.toString();
    });
    res.on('end', function() {
      parent.kill();
      parent.on('exit', function() {
        assert.strictEqual(s, 'hello from worker\n');
        assert.strictEqual(res.statusCode, 200);
        console.log('ok');
        ok = true;
      });
    });
  });
});
function test(cb) {
  console.error('about to listen in parent');
  const server = net.createServer(function(conn) {
    console.error('connection on parent');
    conn.end('hello from parent\n');
  }).listen(0, function() {
    const port = this.address().port;
    console.error(`server listening on ${port}`);
    const spawn = require('child_process').spawn;
    const primary = spawn(process.execPath, [__filename, 'primary'], {
      stdio: [ 0, 'pipe', 2, server._handle, 'ipc' ],
      detached: true
    });
    server.close();
    primary.on('exit', function(code) {
      console.error('primary exited', code);
    });
    primary.on('close', function() {
      console.error('primary closed');
    });
    console.error('primary spawned');
    primary.on('message', function(msg) {
      if (msg === 'started worker') {
        cb(primary, port);
      }
    });
  });
}
function primary() {
  console.error('in primary, spawning worker');
  cluster.setupPrimary({
    args: [ 'worker' ]
  });
  const worker = cluster.fork();
  worker.on('message', function(msg) {
    if (msg === 'worker ready') {
      process.send('started worker');
    }
  });
  process.on('disconnect', function() {
    console.error('primary exit on disconnect');
    process.exit(0);
  });
}
function worker() {
  console.error('worker, about to create server and listen on fd=3');
  http.createServer(function(req, res) {
    console.error('request on worker');
    console.error('%s %s', req.method, req.url, req.headers);
    res.end('hello from worker\n');
  }).listen({ fd: 3 }, function() {
    console.error('worker listening on fd=3');
    process.send('worker ready');
  });
}
