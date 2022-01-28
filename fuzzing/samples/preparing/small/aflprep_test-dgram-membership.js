'use strict';
const assert = require('assert');
const dgram = require('dgram');
const multicastAddress = '224.0.0.114';
const setup = dgram.createSocket.bind(dgram, { type: 'udp4', reuseAddr: true });
{
  const socket = setup();
  socket.addMembership(multicastAddress);
  socket.close();
}
{
  const socket = setup();
  assert.throws(
    () => { socket.dropMembership(multicastAddress); },
  );
  socket.close();
}
{
  const socket = setup();
  socket.addMembership(multicastAddress);
  socket.dropMembership(multicastAddress);
  socket.close();
}
