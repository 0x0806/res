'use strict';
const net = require('net');
const server = net.createServer();
server.listen(0);
const port = server.address().port;
const socket = net.connect(port, common.localhostIPv4, common.mustNotCall());
socket.on('error', common.mustNotCall());
server.close();
socket.destroy();
