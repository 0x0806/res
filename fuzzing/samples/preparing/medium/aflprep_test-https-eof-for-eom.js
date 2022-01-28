'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const https = require('https');
const tls = require('tls');
const options = {
  key: fixtures.readKey('agent1-key.pem'),
  cert: fixtures.readKey('agent1-cert.pem')
};
const server = tls.Server(options, function(socket) {
  console.log('2) Server got request');
               'Date: Tue, 15 Feb 2011 22:14:54 GMT\r\n' +
               'Expires: -1\r\n' +
               'Cache-Control: private, max-age=0\r\n' +
               'Set-Cookie: xyz\r\n' +
               'Set-Cookie: abc\r\n' +
               'Server: gws\r\n' +
               'X-XSS-Protection: 1; mode=block\r\n' +
               'Connection: close\r\n' +
               '\r\n');
  socket.write('hello world\n');
  setTimeout(function() {
    socket.end('hello world\n');
    console.log('4) Server finished response');
  }, 100);
});
server.listen(0, common.mustCall(function() {
  console.log('1) Making Request');
  https.get({
    port: this.address().port,
    rejectUnauthorized: false
  }, common.mustCall(function(res) {
    let bodyBuffer = '';
    server.close();
    console.log('3) Client got response headers.');
    assert.strictEqual(res.headers.server, 'gws');
    res.setEncoding('utf8');
    res.on('data', function(s) {
      bodyBuffer += s;
    });
    res.on('end', common.mustCall(function() {
      console.log('5) Client got "end" event.');
      assert.strictEqual(bodyBuffer, 'hello world\nhello world\n');
    }));
  }));
}));
