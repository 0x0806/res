'use strict';
if (!common.hasIPv6)
  common.skip('no IPv6 support');
const dgram = require('dgram');
const socket = dgram.createSocket({
  type: 'udp6',
  ipv6Only: true,
});
socket.bind({
  port: 0,
  address: '::',
}, common.mustCall(() => {
  const { port } = socket.address();
  const client = dgram.createSocket('udp4');
  client.bind({
    port,
    address: '0.0.0.0',
  }, common.mustCall(() => {
    client.close();
    socket.close();
  }));
  client.on('error', common.mustNotCall());
}));
