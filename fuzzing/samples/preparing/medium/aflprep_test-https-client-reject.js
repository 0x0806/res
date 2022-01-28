'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt')
};
const server = https.createServer(options, common.mustCall(function(req, res) {
  res.writeHead(200);
  res.end();
  req.resume();
}, 2)).listen(0, function() {
  unauthorized();
});
function unauthorized() {
  const req = https.request({
    port: server.address().port,
    rejectUnauthorized: false
  }, function(res) {
    assert(!req.socket.authorized);
    res.resume();
    rejectUnauthorized();
  });
  req.on('error', function(err) {
    throw err;
  });
  req.end();
}
function rejectUnauthorized() {
  const options = {
    port: server.address().port
  };
  options.agent = new https.Agent(options);
  const req = https.request(options, common.mustNotCall());
  req.on('error', function(err) {
    authorized();
  });
  req.end();
}
function authorized() {
  const options = {
    port: server.address().port,
    ca: [fixtures.readKey('rsa_cert.crt')]
  };
  options.agent = new https.Agent(options);
  const req = https.request(options, function(res) {
    res.resume();
    assert(req.socket.authorized);
    server.close();
  });
  req.on('error', common.mustNotCall());
  req.end();
}
