'use strict';
const http = require('http');
const net = require('net');
const COUNT = 10;
const server = http
  .createServer(
    common.mustCall((req, res) => {
      server.close();
      res.writeHead(200);
      res.write('data');
      setTimeout(function() {
        res.end();
      }, (Math.random() * 100) | 0);
    }, COUNT)
  )
  .listen(0, function() {
    const s = net.connect(this.address().port);
    s.write(big);
    s.resume();
  });
