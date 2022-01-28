'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const { SSL_OP_NO_TICKET } = require('crypto').constants;
const options = {
  key: readKey('agent1-key.pem'),
  cert: readKey('agent1-cert.pem'),
  secureOptions: SSL_OP_NO_TICKET,
  ciphers: 'RSA@SECLEVEL=0'
};
https.createServer(options, function(req, res) {
  res.end('ohai');
}).listen(0, function() {
  first(this);
});
function first(server) {
  const port = server.address().port;
  const req = https.request({
    port: port,
    rejectUnauthorized: false
  }, function(res) {
    res.resume();
    server.close(function() {
      faultyServer(port);
    });
  });
  req.end();
}
function faultyServer(port) {
  options.secureProtocol = 'TLSv1_method';
  https.createServer(options, function(req, res) {
    res.end('hello faulty');
  }).listen(port, function() {
    second(this);
  });
}
function second(server, session) {
  const req = https.request({
    port: server.address().port,
    rejectUnauthorized: false
  }, function(res) {
    res.resume();
  });
  req.on('response', common.mustCall(function(res) {
    server.close();
  }));
  req.end();
}
