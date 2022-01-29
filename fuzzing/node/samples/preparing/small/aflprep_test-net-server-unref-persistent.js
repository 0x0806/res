'use strict';
const net = require('net');
const server = net.createServer();
server.unref();
server.listen();
setTimeout(common.mustNotCall(), 1000).unref();
