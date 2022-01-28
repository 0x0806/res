'use strict';
if (!common.opensslCli)
  common.skip('node compiled without OpenSSL CLI.');
if (!common.hasCrypto)
  common.skip('missing crypto');
tmpdir.refresh();
doTest();
function doTest() {
  const assert = require('assert');
  const tls = require('tls');
  const fs = require('fs');
  const join = require('path').join;
  const spawn = require('child_process').spawn;
  const SESSION_TIMEOUT = 1;
  const key = fixtures.readKey('rsa_private.pem');
  const cert = fixtures.readKey('rsa_cert.crt');
  const options = {
    key: key,
    cert: cert,
    ca: [cert],
    sessionTimeout: SESSION_TIMEOUT,
    maxVersion: 'TLSv1.2',
  };
  const sessionFileName = (function() {
    const ticketFileName = 'tls-session-ticket.txt';
    const tmpPath = join(tmpdir.path, ticketFileName);
    fs.writeFileSync(tmpPath, fixtures.readSync(ticketFileName));
    return tmpPath;
  }());
  function Client(cb) {
    const flags = [
      's_client',
      '-connect', `localhost:${common.PORT}`,
      '-sess_in', sessionFileName,
      '-sess_out', sessionFileName,
    ];
    const client = spawn(common.opensslCli, flags, {
      stdio: ['ignore', 'pipe', 'ignore']
    });
    let clientOutput = '';
    client.stdout.on('data', (data) => {
      clientOutput += data.toString();
    });
    client.on('exit', (code) => {
      let connectionType;
      const grepConnectionType = (line) => {
        if (matches) {
          connectionType = matches[1];
          return true;
        }
      };
      const lines = clientOutput.split('\n');
      if (!lines.some(grepConnectionType)) {
        throw new Error('unexpected output from openssl client');
      }
      assert.strictEqual(code, 0);
      cb(connectionType);
    });
  }
  const server = tls.createServer(options, (cleartext) => {
    cleartext.on('error', (er) => {
      if (er.code !== 'ECONNRESET')
        throw er;
    });
    cleartext.end();
  });
  server.listen(common.PORT, () => {
    Client((connectionType) => {
      assert.strictEqual(connectionType, 'New');
      Client((connectionType) => {
        assert.strictEqual(connectionType, 'Reused');
        setTimeout(() => {
          Client((connectionType) => {
            assert.strictEqual(connectionType, 'New');
            server.close();
          });
        }, (SESSION_TIMEOUT + 1) * 1000);
      });
    });
  });
}
