'use strict';
const assert = require('assert');
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
socket.bind();
let fired = false;
const timer = setTimeout(() => {
  socket.close();
}, 100);
socket.on('listening', common.mustCall(() => {
  clearTimeout(timer);
  fired = true;
  socket.close();
}));
socket.on('close', common.mustCall(() => {
  assert(fired, 'listening should fire after bind');
}));
