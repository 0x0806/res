'use strict';
const http = require('http');
const opts = {
  host: '127.0.0.1',
  port: null,
  method: 'GET',
  agent: false
};
const req = http.request(opts);
const oneResponse = common.mustCall();
req.on('response', oneResponse);
req.on('error', oneResponse);
req.end();
