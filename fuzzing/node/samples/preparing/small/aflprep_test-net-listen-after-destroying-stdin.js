'use strict';
const net = require('net');
process.stdin.destroy();
const server = net.createServer(common.mustCall((socket) => {
  console.log('accepted...');
  socket.end(common.mustCall(() => { console.log('finished...'); }));
  server.close(common.mustCall(() => { console.log('closed'); }));
}));
server.listen(0, common.mustCall(() => {
  console.log('listening...');
  net.createConnection(server.address().port);
}));
