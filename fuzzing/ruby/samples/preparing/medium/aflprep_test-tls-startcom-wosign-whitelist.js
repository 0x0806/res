'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
let finished = 0;
function loadPEM(n) {
  return fixtures.readKey(`${n}.pem`);
}
const testCases = [
    serverOpts: {
      key: loadPEM('agent8-key'),
      cert: loadPEM('agent8-cert')
    },
    clientOpts: {
      ca: loadPEM('fake-startcom-root-cert'),
      port: undefined,
      rejectUnauthorized: true
    },
    errorCode: 'CERT_REVOKED'
  },
    serverOpts: {
      key: loadPEM('agent9-key'),
      cert: loadPEM('agent9-cert')
    },
    clientOpts: {
      ca: loadPEM('fake-startcom-root-cert'),
      port: undefined,
      rejectUnauthorized: true
    },
    errorCode: 'CERT_REVOKED'
  },
];
function runNextTest(server, tindex) {
  server.close(function() {
    finished++;
    runTest(tindex + 1);
  });
}
function runTest(tindex) {
  const tcase = testCases[tindex];
  if (!tcase) return;
  const server = tls.createServer(tcase.serverOpts, function(s) {
    s.resume();
  }).listen(0, function() {
    tcase.clientOpts.port = this.address().port;
    const client = tls.connect(tcase.clientOpts);
    client.on('error', function(e) {
      assert.strictEqual(e.code, tcase.errorCode);
      runNextTest(server, tindex);
    });
    client.on('secureConnect', function() {
      assert.strictEqual(tcase.errorCode, 'CERT_REVOKED');
      client.end();
      runNextTest(server, tindex);
    });
  });
}
runTest(0);
process.on('exit', function() {
  assert.strictEqual(finished, testCases.length);
});
