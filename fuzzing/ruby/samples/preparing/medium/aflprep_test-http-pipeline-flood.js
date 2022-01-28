'use strict';
switch (process.argv[2]) {
  case undefined:
    return parent();
  case 'child':
    return child();
  default:
    throw new Error(`Unexpected value: ${process.argv[2]}`);
}
function parent() {
  const http = require('http');
  const bigResponse = Buffer.alloc(10240, 'x');
  let backloggedReqs = 0;
  const server = http.createServer(function(req, res) {
    res.setHeader('content-length', bigResponse.length);
    if (!res.write(bigResponse)) {
      if (backloggedReqs === 0) {
        setImmediate(() => {
          req.socket.on('data', common.mustNotCall('Unexpected data received'));
        });
      }
      backloggedReqs++;
    }
    res.end();
  });
  server.on('connection', common.mustCall());
  server.listen(0, function() {
    const spawn = require('child_process').spawn;
    const args = [__filename, 'child', this.address().port];
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('close', common.mustCall(function() {
      server.close();
    }));
    server.setTimeout(200, common.mustCallAtLeast(function() {
      child.kill();
    }, 1));
  });
}
function child() {
  const net = require('net');
  const port = +process.argv[3];
  const conn = net.connect({ port });
  req = req.repeat(10240);
  conn.on('connect', write);
  conn.on('drain', common.mustCall(write));
  function write() {
    while (false !== conn.write(req, 'ascii'));
  }
}
