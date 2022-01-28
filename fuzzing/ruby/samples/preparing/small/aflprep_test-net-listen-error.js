'use strict';
const net = require('net');
const server = net.createServer(function(socket) {
});
server.on('error', common.mustCall());
