'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const options = {
  key: fixtures.readKey('rsa_private.pem'),
  cert: fixtures.readKey('rsa_cert.crt')
};
const server = tls.createServer(options, function(socket) {
  socket.pipe(socket);
  socket.on('end', () => socket.end());
}).listen(0, common.mustCall(function() {
  unauthorized();
}));
function unauthorized() {
  console.log('connect unauthorized');
  const socket = tls.connect({
    port: server.address().port,
    servername: 'localhost',
    rejectUnauthorized: false
  }, common.mustCall(function() {
    let _data;
    assert(!socket.authorized);
    socket.on('data', common.mustCall((data) => {
      assert.strictEqual(data.toString(), 'ok');
      _data = data;
    }));
    socket.on('end', common.mustCall(() => {
      assert(_data, 'data failed to echo!');
    }));
    socket.on('end', () => rejectUnauthorized());
  }));
  socket.once('session', common.mustCall(() => {
  }));
  socket.on('error', common.mustNotCall());
  socket.end('ok');
}
function rejectUnauthorized() {
  console.log('reject unauthorized');
  const socket = tls.connect(server.address().port, {
    servername: 'localhost'
  }, common.mustNotCall());
  socket.on('data', common.mustNotCall());
  socket.on('error', common.mustCall(function(err) {
    rejectUnauthorizedUndefined();
  }));
  socket.end('ng');
}
function rejectUnauthorizedUndefined() {
  console.log('reject unauthorized undefined');
  const socket = tls.connect(server.address().port, {
    servername: 'localhost',
    rejectUnauthorized: undefined
  }, common.mustNotCall());
  socket.on('data', common.mustNotCall());
  socket.on('error', common.mustCall(function(err) {
    authorized();
  }));
  socket.end('ng');
}
function authorized() {
  console.log('connect authorized');
  const socket = tls.connect(server.address().port, {
    ca: [fixtures.readKey('rsa_cert.crt')],
    servername: 'localhost'
  }, common.mustCall(function() {
    console.log('... authorized');
    assert(socket.authorized);
    socket.on('data', common.mustCall((data) => {
      assert.strictEqual(data.toString(), 'ok');
    }));
    socket.on('end', () => server.close());
  }));
  socket.on('error', common.mustNotCall());
  socket.end('ok');
}
