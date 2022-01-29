'use strict';
const net = require('net');
const seconds = 5;
let counter = 0;
const server = net.createServer(function(socket) {
  const interval = setInterval(function() {
    counter++;
    if (counter === seconds) {
      clearInterval(interval);
      server.close();
      socket.destroy();
    }
    if (socket.writable) {
      socket.write(`${Date.now()}\n`);
    }
  }, 1000);
});
server.listen(0, function() {
  const s = net.connect(server.address().port);
  s.pipe(process.stdout);
});
