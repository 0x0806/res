'use strict';
const http = require('http');
const net = require('net');
const seeds = [ 3, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4 ];
const countdown = new Countdown(seeds.length, () => server.close());
const server = http.createServer(common.mustCall(function(req, res) {
  switch (req.url) {
      return setImmediate(function() {
        req.socket.destroy();
        server.emit('requestDone');
      });
      return process.nextTick(function() {
        res.destroy();
        server.emit('requestDone');
      });
      res.write('hello ');
      return setImmediate(function() {
        res.end('world!');
        server.emit('requestDone');
      });
    default:
      res.destroy();
      server.emit('requestDone');
  }
}, seeds.length));
function generator(seeds) {
  const port = server.address().port;
  return seeds.map(function(r) {
           `Host: localhost:${port}\r\n` +
           '\r\n' +
           '\r\n';
  }).join('');
}
server.listen(0, common.mustCall(function() {
  const client = net.connect({ port: this.address().port });
  server.on('requestDone', function() {
    countdown.dec();
  });
  client.write(generator(seeds));
}));
