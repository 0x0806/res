'use strict';
const dgram = require('dgram');
process.on('warning', common.mustNotCall());
const reservePortSocket = dgram.createSocket('udp4');
reservePortSocket.bind(() => {
  const { port } = reservePortSocket.address();
  const newSocket = dgram.createSocket('udp4');
  let errors = 0;
  newSocket.on('error', common.mustCall(() => {
    if (++errors < 20) {
      newSocket.bind(port, common.mustNotCall());
    } else {
      newSocket.close();
      reservePortSocket.close();
    }
  }, 20));
  newSocket.bind(port, common.mustNotCall());
});
