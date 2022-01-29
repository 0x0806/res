'use strict';
const net = require('net');
const socket = new net.Socket();
socket.on('close', common.mustCall());
socket.destroy();
