'use strict';
const net = require('net');
const client = net.createConnection(53, '8.8.8.8', function() {
  client.unref();
});
client.on('close', common.mustNotCall());
