'use strict';
const net = require('net');
const c = net.createConnection(80, 'google.com');
c.destroy();
