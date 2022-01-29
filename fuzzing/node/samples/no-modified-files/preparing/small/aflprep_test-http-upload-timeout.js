'use strict';
const http = require('http');
const server = http.createServer();
let connections = 0;
server.on('request', function(req, res) {
  req.socket.setTimeout(1000);
  req.socket.on('timeout', function() {
    throw new Error('Unexpected timeout');
  });
  req.on('end', function() {
    connections--;
    res.writeHead(200);
    res.end('done\n');
    if (connections === 0) {
      server.close();
    }
  });
  req.resume();
});
server.listen(0, '127.0.0.1', function() {
  for (let i = 0; i < 10; i++) {
    connections++;
    setTimeout(function() {
      const request = http.request({
        port: server.address().port,
        method: 'POST',
      });
      function ping() {
        const nextPing = (Math.random() * 900).toFixed();
        if (nextPing > 600) {
          request.end();
          return;
        }
        request.write('ping');
        setTimeout(ping, nextPing);
      }
      ping();
    }, i * 50);
  }
});
