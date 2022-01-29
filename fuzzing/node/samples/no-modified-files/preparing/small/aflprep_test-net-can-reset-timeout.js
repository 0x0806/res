'use strict';
const net = require('net');
const server = net.createServer(common.mustCall(function(stream) {
  stream.setTimeout(100);
  stream.resume();
  stream.once('timeout', common.mustCall(function() {
    console.log('timeout');
    stream.write('WHAT.');
  }));
  stream.on('end', common.mustCall(function() {
    console.log('server side end');
    stream.end();
  }));
}));
server.listen(0, common.mustCall(function() {
  const c = net.createConnection(this.address().port);
  c.on('data', function() {
    c.end();
  });
  c.on('end', function() {
    console.log('client side end');
    server.close();
  });
}));
