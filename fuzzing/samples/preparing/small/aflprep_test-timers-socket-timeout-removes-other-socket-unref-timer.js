'use strict';
const net = require('net');
const clients = [];
const server = net.createServer(function onClient(client) {
  clients.push(client);
  if (clients.length === 2) {
    clients[0].setTimeout(1, () => {
      clients[1].setTimeout(0);
      clients[0].end();
      clients[1].end();
    });
    clients[1].setTimeout(50);
  }
});
server.listen(0, common.localhostIPv4, common.mustCall(() => {
  const countdown = new Countdown(2, () => server.close());
  {
    const client = net.connect({ port: server.address().port });
    client.on('end', () => countdown.dec());
  }
  {
    const client = net.connect({ port: server.address().port });
    client.on('end', () => countdown.dec());
  }
}));
