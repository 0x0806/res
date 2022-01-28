'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.opensslCli)
  common.skip('missing openssl-cli');
const assert = require('assert');
const tls = require('tls');
const net = require('net');
const spawn = require('child_process').spawn;
const key = fixtures.readKey('rsa_private.pem');
const cert = fixtures.readKey('rsa_cert.crt');
function log(a) {
  console.error('***server***', a);
}
const server = net.createServer(common.mustCall(function(socket) {
  log(`connection fd=${socket.fd}`);
  const sslcontext = tls.createSecureContext({ key, cert });
  sslcontext.context.setCiphers('RC4-SHA:AES128-SHA:AES256-SHA');
  const pair = tls.createSecurePair(sslcontext, true);
  assert.ok(pair.encrypted.writable);
  assert.ok(pair.cleartext.writable);
  pair.encrypted.pipe(socket);
  socket.pipe(pair.encrypted);
  log('i set it secure');
  pair.on('secure', function() {
    log('connected+secure!');
    pair.cleartext.write('hello\r\n');
    log(pair.cleartext.getPeerCertificate());
    log(pair.cleartext.getCipher());
  });
  pair.cleartext.on('data', function(data) {
    log(`read bytes ${data.length}`);
    pair.cleartext.write(data);
  });
  socket.on('end', function() {
    log('socket end');
  });
  pair.cleartext.on('error', function(err) {
    log('got error: ');
    log(err);
    socket.destroy();
  });
  pair.encrypted.on('error', function(err) {
    log('encrypted error: ');
    log(err);
    socket.destroy();
  });
  socket.on('error', function(err) {
    log('socket error: ');
    log(err);
    socket.destroy();
  });
  socket.on('close', function(err) {
    log('socket closed');
  });
  pair.on('error', function(err) {
    log('secure error: ');
    log(err);
    socket.destroy();
  });
}));
let gotHello = false;
let sentWorld = false;
let gotWorld = false;
server.listen(0, common.mustCall(function() {
  const args = ['s_client', '-connect', `127.0.0.1:${this.address().port}`];
  const client = spawn(common.opensslCli, args);
  let out = '';
  client.stdout.setEncoding('utf8');
  client.stdout.on('data', function(d) {
    out += d;
      gotHello = true;
      client.stdin.write('world\r\n');
      sentWorld = true;
    }
      gotWorld = true;
      client.stdin.end();
    }
  });
  client.stdout.pipe(process.stdout, { end: false });
  client.on('exit', common.mustCall(function(code) {
    assert.strictEqual(code, 0);
    server.close();
  }));
}));
process.on('exit', function() {
  assert.ok(gotHello);
  assert.ok(sentWorld);
  assert.ok(gotWorld);
});
