'use strict';
const net = require('net');
const server = net.createServer();
server.getConnections(common.mustCall());
