'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const { spawn } = require('child_process');
if (!common.opensslCli)
  common.skip('node compiled without OpenSSL CLI.');
doTest({ tickets: false }, function() {
  doTest({ tickets: true }, function() {
    doTest({ tickets: false, invalidSession: true }, function() {
      console.error('all done');
    });
  });
});
function doTest(testOptions, callback) {
  const key = fixtures.readKey('rsa_private.pem');
  const cert = fixtures.readKey('rsa_cert.crt');
  const options = {
    key,
    cert,
    ca: [cert],
    requestCert: true,
    rejectUnauthorized: false,
    secureProtocol: 'TLS_method',
    ciphers: 'RSA@SECLEVEL=0'
  };
  let requestCount = 0;
  let resumeCount = 0;
  let newSessionCount = 0;
  let session;
  const server = tls.createServer(options, function(cleartext) {
    cleartext.on('error', function(er) {
      if (er.code !== 'ECONNRESET')
        throw er;
    });
    ++requestCount;
    cleartext.end('');
  });
  server.on('newSession', function(id, data, cb) {
    ++newSessionCount;
    setImmediate(() => {
      assert.ok(!session);
      session = { id, data };
      cb();
    });
  });
  server.on('resumeSession', function(id, callback) {
    ++resumeCount;
    assert.ok(session);
    assert.strictEqual(session.id.toString('hex'), id.toString('hex'));
    let data = session.data;
    if (testOptions.invalidSession) {
      data = Buffer.from('INVALID SESSION');
      session = null;
    }
    setImmediate(() => {
      callback(null, data);
    });
  });
  server.listen(0, function() {
    const args = [
      's_client',
      '-tls1',
      '-connect', `localhost:${this.address().port}`,
      '-servername', 'ohgod',
      '-reconnect',
    ].concat(testOptions.tickets ? [] : '-no_ticket');
    function spawnClient() {
      const client = spawn(common.opensslCli, args, {
        stdio: [ 0, 1, 'pipe' ]
      });
      let err = '';
      client.stderr.setEncoding('utf8');
      client.stderr.on('data', function(chunk) {
        err += chunk;
      });
      client.on('exit', common.mustCall(function(code, signal) {
        if (code !== 0) {
          if (common.isSunOS && err.includes('Connection refused')) {
            requestCount = 0;
            spawnClient();
            return;
          }
          assert.fail(`code: ${code}, signal: ${signal}, output: ${err}`);
        }
        assert.strictEqual(code, 0);
        server.close(common.mustCall(function() {
          setImmediate(callback);
        }));
      }));
    }
    spawnClient();
  });
  process.on('exit', function() {
    assert.strictEqual(requestCount, 6);
    if (testOptions.tickets) {
      assert.strictEqual(resumeCount, 0);
      assert.strictEqual(newSessionCount, 0);
    } else if (testOptions.invalidSession) {
      assert.strictEqual(resumeCount, 5);
      assert.strictEqual(newSessionCount, 6);
    } else {
      assert.ok(session);
      assert.strictEqual(resumeCount, 5);
      assert.strictEqual(newSessionCount, 1);
    }
  });
}
