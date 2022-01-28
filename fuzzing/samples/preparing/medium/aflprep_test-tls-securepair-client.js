'use strict';
if (!common.opensslCli)
  common.skip('node compiled without OpenSSL CLI.');
if (!common.hasCrypto)
  common.skip('missing crypto');
if (common.isWindows)
const net = require('net');
const assert = require('assert');
const tls = require('tls');
const spawn = require('child_process').spawn;
test1();
function test1() {
}
function test2() {
  function check(pair) {
    assert.strictEqual(pair.cleartext.getPeerCertificate().ext_key_usage.length,
                       1);
    assert.strictEqual(pair.cleartext.getPeerCertificate().ext_key_usage[0],
                       '1.3.6.1.5.5.7.3.2');
  }
}
function test(keyPath, certPath, check, next) {
  const key = fixtures.readSync(keyPath).toString();
  const cert = fixtures.readSync(certPath).toString();
  const server = spawn(common.opensslCli, ['s_server',
                                           '-accept', 0,
                                           '-cert', fixtures.path(certPath),
                                           '-key', fixtures.path(keyPath)]);
  server.stdout.pipe(process.stdout);
  server.stderr.pipe(process.stdout);
  let state = 'WAIT-ACCEPT';
  let serverStdoutBuffer = '';
  server.stdout.setEncoding('utf8');
  server.stdout.on('data', function(s) {
    serverStdoutBuffer += s;
    console.log(state);
    switch (state) {
      case 'WAIT-ACCEPT':
        if (matches) {
          const port = matches[1];
          state = 'WAIT-HELLO';
          startClient(port);
        }
        break;
      case 'WAIT-HELLO':
          server.stdin.write('Q');
          state = 'WAIT-SERVER-CLOSE';
        }
        break;
      default:
        break;
    }
  });
  const timeout = setTimeout(function() {
    server.kill();
    process.exit(1);
  }, 5000);
  let gotWriteCallback = false;
  let serverExitCode = -1;
  server.on('exit', function(code) {
    serverExitCode = code;
    clearTimeout(timeout);
    if (next) next();
  });
  function startClient(port) {
    const s = new net.Stream();
    const sslcontext = tls.createSecureContext({ key, cert });
    sslcontext.context.setCiphers('RC4-SHA:AES128-SHA:AES256-SHA');
    const pair = tls.createSecurePair(sslcontext, false);
    assert.ok(pair.encrypted.writable);
    assert.ok(pair.cleartext.writable);
    pair.encrypted.pipe(s);
    s.pipe(pair.encrypted);
    s.connect(port);
    s.on('connect', function() {
      console.log('client connected');
      setTimeout(function() {
        pair.cleartext.write('hello\r\n', function() {
          gotWriteCallback = true;
        });
      }, 500);
    });
    pair.on('secure', function() {
      console.log('client: connected+secure!');
      console.log('client pair.cleartext.getPeerCertificate(): %j',
                  pair.cleartext.getPeerCertificate());
      console.log('client pair.cleartext.getCipher(): %j',
                  pair.cleartext.getCipher());
      if (check) check(pair);
    });
    pair.cleartext.on('data', function(d) {
      console.log('cleartext: %s', d.toString());
    });
    s.on('close', function() {
      console.log('client close');
    });
    pair.encrypted.on('error', function(err) {
      console.log(`encrypted error: ${err}`);
    });
    s.on('error', function(err) {
      console.log(`socket error: ${err}`);
    });
    pair.on('error', function(err) {
      console.log(`secure error: ${err}`);
    });
  }
  process.on('exit', function() {
    assert.strictEqual(serverExitCode, 0);
    assert.strictEqual(state, 'WAIT-SERVER-CLOSE');
    assert.ok(gotWriteCallback);
  });
}
