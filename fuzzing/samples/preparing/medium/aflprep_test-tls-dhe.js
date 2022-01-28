'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.opensslCli)
  common.skip('missing openssl-cli');
const assert = require('assert');
const tls = require('tls');
const spawn = require('child_process').spawn;
const key = fixtures.readKey('agent2-key.pem');
const cert = fixtures.readKey('agent2-cert.pem');
let nsuccess = 0;
let ntests = 0;
const ciphers = 'DHE-RSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256';
common.expectWarning('SecurityWarning',
                     'DH parameter is less than 2048 bits');
function loadDHParam(n) {
  const keyname = `dh${n}.pem`;
  return fixtures.readKey(keyname);
}
function test(keylen, expectedCipher, cb) {
  const options = {
    key: key,
    cert: cert,
    ciphers: ciphers,
    dhparam: loadDHParam(keylen)
  };
  const server = tls.createServer(options, function(conn) {
    conn.end();
  });
  server.on('close', function(err) {
    assert.ifError(err);
    if (cb) cb();
  });
  server.listen(0, '127.0.0.1', function() {
    const args = ['s_client', '-connect', `127.0.0.1:${this.address().port}`,
                  '-cipher', ciphers];
    const client = spawn(common.opensslCli, args);
    let out = '';
    client.stdout.setEncoding('utf8');
    client.stdout.on('data', function(d) {
      out += d;
    });
    client.stdout.on('end', function() {
      const reg = new RegExp(`Cipher    : ${expectedCipher}`);
      if (reg.test(out)) {
        nsuccess++;
        server.close();
      }
    });
  });
}
function test512() {
  assert.throws(function() {
    test(512, 'DHE-RSA-AES128-SHA256', null);
}
function test1024() {
  test(1024, 'DHE-RSA-AES128-SHA256', test2048);
  ntests++;
}
function test2048() {
  test(2048, 'DHE-RSA-AES128-SHA256', testError);
  ntests++;
}
function testError() {
  test('error', 'ECDHE-RSA-AES128-SHA256', test512);
  ntests++;
}
test1024();
process.on('exit', function() {
  assert.strictEqual(ntests, nsuccess);
  assert.strictEqual(ntests, 3);
});
