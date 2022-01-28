'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const https = require('https');
const http = require('http');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const body = 'hello world\n';
const server_http = http.createServer(function(req, res) {
  console.log('got HTTP request');
  res.end(body);
});
server_http.listen(0, function() {
  const req = http.request({
    port: this.address().port,
    rejectUnauthorized: false
  }, function(res) {
    server_http.close();
    res.resume();
  });
  req.setNoDelay(true);
  req.setTimeout(1000, () => {});
  req.setSocketKeepAlive(true, 1000);
  req.end();
});
const server_https = https.createServer(options, function(req, res) {
  console.log('got HTTPS request');
  res.end(body);
});
server_https.listen(0, function() {
  const req = https.request({
    port: this.address().port,
    rejectUnauthorized: false
  }, function(res) {
    server_https.close();
    res.resume();
  });
  req.setNoDelay(true);
  req.setTimeout(1000, () => {});
  req.setSocketKeepAlive(true, 1000);
  req.end();
});
