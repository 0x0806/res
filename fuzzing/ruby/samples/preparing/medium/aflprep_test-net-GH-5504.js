'use strict';
switch (process.argv[2]) {
  case 'server': return server();
  case 'client': return client();
  case undefined: return parent();
  default: throw new Error('invalid');
}
function server() {
  const net = require('net');
  const content = Buffer.alloc(64 * 1024 * 1024, '#');
  net.createServer(function(socket) {
    this.close();
    socket.on('end', function() {
      console.error('end');
    });
    socket.on('_socketEnd', function() {
      console.error('_socketEnd');
    });
    socket.write(content);
  }).listen(common.PORT, common.localhostIPv4, function() {
    console.log('listening');
  });
}
function client() {
  const net = require('net');
  const client = net.connect({
    host: common.localhostIPv4,
    port: common.PORT
  }, function() {
    client.destroy();
  });
}
function parent() {
  const spawn = require('child_process').spawn;
  const node = process.execPath;
  const s = spawn(node, [__filename, 'server'], {
    env: Object.assign(process.env, {
      NODE_DEBUG: 'net'
    })
  });
  wrap(s.stderr, process.stderr, 'SERVER 2>');
  wrap(s.stdout, process.stdout, 'SERVER 1>');
  s.on('exit', common.mustCall());
  s.stdout.once('data', common.mustCall(function() {
    const c = spawn(node, [__filename, 'client']);
    wrap(c.stderr, process.stderr, 'CLIENT 2>');
    wrap(c.stdout, process.stdout, 'CLIENT 1>');
    c.on('exit', common.mustCall());
  }));
  function wrap(inp, out, w) {
    inp.setEncoding('utf8');
    inp.on('data', function(chunk) {
      chunk = chunk.trim();
      if (!chunk) return;
      out.write(`${w}${chunk.split('\n').join(`\n${w}`)}\n`);
    });
  }
}
