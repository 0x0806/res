'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = https.createServer(options, function() {
  console.log('Got request.  Doing nothing.');
}).listen(0, common.mustCall(function() {
  const req = https.request({
    host: 'localhost',
    port: this.address().port,
    method: 'GET',
    rejectUnauthorized: false
  });
  req.setTimeout(10);
  req.end();
  req.on('response', function() {
    console.log('got response');
  });
  req.on('error', common.expectsError({
    message: 'socket hang up',
    code: 'ECONNRESET',
    name: 'Error'
  }));
  req.on('timeout', common.mustCall(function() {
    console.log('timeout occurred outside');
    req.destroy();
    server.close();
  }));
}));
