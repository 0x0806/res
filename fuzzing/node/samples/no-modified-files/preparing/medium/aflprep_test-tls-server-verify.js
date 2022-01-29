'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
if (!common.opensslCli)
  common.skip('node compiled without OpenSSL CLI.');
const assert = require('assert');
const { spawn } = require('child_process');
const { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } =
  require('crypto').constants;
const tls = require('tls');
const testCases =
  [{ title: 'Do not request certs. Everyone is unauthorized.',
     requestCert: false,
     rejectUnauthorized: false,
     renegotiate: false,
     CAs: ['ca1-cert'],
     clients:
     [{ name: 'agent1', shouldReject: false, shouldAuth: false },
      { name: 'agent2', shouldReject: false, shouldAuth: false },
      { name: 'agent3', shouldReject: false, shouldAuth: false },
      { name: 'nocert', shouldReject: false, shouldAuth: false },
     ] },
   { title: 'Allow both authed and unauthed connections with CA1',
     requestCert: true,
     rejectUnauthorized: false,
     renegotiate: false,
     CAs: ['ca1-cert'],
     clients:
    [{ name: 'agent1', shouldReject: false, shouldAuth: true },
     { name: 'agent2', shouldReject: false, shouldAuth: false },
     { name: 'agent3', shouldReject: false, shouldAuth: false },
     { name: 'nocert', shouldReject: false, shouldAuth: false },
    ] },
   { title: 'Do not request certs at connection. Do that later',
     requestCert: false,
     rejectUnauthorized: false,
     renegotiate: true,
     CAs: ['ca1-cert'],
     clients:
    [{ name: 'agent1', shouldReject: false, shouldAuth: true },
     { name: 'agent2', shouldReject: false, shouldAuth: false },
     { name: 'agent3', shouldReject: false, shouldAuth: false },
     { name: 'nocert', shouldReject: false, shouldAuth: false },
    ] },
   { title: 'Allow only authed connections with CA1',
     requestCert: true,
     rejectUnauthorized: true,
     renegotiate: false,
     CAs: ['ca1-cert'],
     clients:
    [{ name: 'agent1', shouldReject: false, shouldAuth: true },
     { name: 'agent2', shouldReject: true },
     { name: 'agent3', shouldReject: true },
     { name: 'nocert', shouldReject: true },
    ] },
   { title: 'Allow only authed connections with CA1 and CA2',
     requestCert: true,
     rejectUnauthorized: true,
     renegotiate: false,
     CAs: ['ca1-cert', 'ca2-cert'],
     clients:
    [{ name: 'agent1', shouldReject: false, shouldAuth: true },
     { name: 'agent2', shouldReject: true },
     { name: 'agent3', shouldReject: false, shouldAuth: true },
     { name: 'nocert', shouldReject: true },
    ] },
   { title: 'Allow only certs signed by CA2 but not in the CRL',
     requestCert: true,
     rejectUnauthorized: true,
     renegotiate: false,
     CAs: ['ca2-cert'],
     crl: 'ca2-crl',
     clients: [
       { name: 'agent1', shouldReject: true, shouldAuth: false },
       { name: 'agent2', shouldReject: true, shouldAuth: false },
       { name: 'agent3', shouldReject: false, shouldAuth: true },
       { name: 'agent4', shouldReject: true, shouldAuth: false },
       { name: 'nocert', shouldReject: true },
     ] },
  ];
function filenamePEM(n) {
  return fixtures.path('keys', `${n}.pem`);
}
function loadPEM(n) {
  return fixtures.readKey(`${n}.pem`);
}
const serverKey = loadPEM('agent2-key');
const serverCert = loadPEM('agent2-cert');
function runClient(prefix, port, options, cb) {
  const args = ['s_client', '-connect', `127.0.0.1:${port}`];
  console.log(`${prefix}  connecting with`, options.name);
  switch (options.name) {
    case 'agent1':
      args.push('-key');
      args.push(filenamePEM('agent1-key'));
      args.push('-cert');
      args.push(filenamePEM('agent1-cert'));
      break;
    case 'agent2':
      args.push('-key');
      args.push(filenamePEM('agent2-key'));
      args.push('-cert');
      args.push(filenamePEM('agent2-cert'));
      break;
    case 'agent3':
      args.push('-key');
      args.push(filenamePEM('agent3-key'));
      args.push('-cert');
      args.push(filenamePEM('agent3-cert'));
      break;
    case 'agent4':
      args.push('-key');
      args.push(filenamePEM('agent4-key'));
      args.push('-cert');
      args.push(filenamePEM('agent4-cert'));
      break;
    case 'nocert':
      break;
    default:
      throw new Error(`${prefix}Unknown agent name`);
  }
  const client = spawn(common.opensslCli, args);
  let out = '';
  let rejected = true;
  let authed = false;
  let goodbye = false;
  client.stdout.setEncoding('utf8');
  client.stdout.on('data', function(d) {
    out += d;
      console.error(`${prefix}  * unauthed`);
      goodbye = true;
      client.kill();
      authed = false;
      rejected = false;
    }
      console.error(`${prefix}  * authed`);
      goodbye = true;
      client.kill();
      authed = true;
      rejected = false;
    }
  });
  client.on('exit', function(code) {
    if (options.shouldReject) {
      assert.strictEqual(
        rejected, true,
        `${prefix}${options.name} NOT rejected, but should have been`);
    } else {
      assert.strictEqual(
        rejected, false,
        `${prefix}${options.name} rejected, but should NOT have been`);
      assert.strictEqual(
        authed, options.shouldAuth,
        `${prefix}${options.name} authed is ${authed} but should have been ${
          options.shouldAuth}`);
    }
    cb();
  });
}
let successfulTests = 0;
function runTest(port, testIndex) {
  const prefix = `${testIndex} `;
  const tcase = testCases[testIndex];
  if (!tcase) return;
  console.error(`${prefix}Running '${tcase.title}'`);
  const cas = tcase.CAs.map(loadPEM);
  const crl = tcase.crl ? loadPEM(tcase.crl) : null;
  const serverOptions = {
    key: serverKey,
    cert: serverCert,
    ca: cas,
    crl: crl,
    requestCert: tcase.requestCert,
    rejectUnauthorized: tcase.rejectUnauthorized
  };
  if (tcase.renegotiate) {
    serverOptions.secureOptions =
        SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION;
    serverOptions.maxVersion = 'TLSv1.2';
  }
  let renegotiated = false;
  const server = tls.Server(serverOptions, function handleConnection(c) {
    c.on('error', function(e) {
    });
    if (tcase.renegotiate && !renegotiated) {
      renegotiated = true;
      setTimeout(function() {
        console.error(`${prefix}- connected, renegotiating`);
        c.write('\n_renegotiating\n');
        return c.renegotiate({
          requestCert: true,
          rejectUnauthorized: false
        }, function(err) {
          assert.ifError(err);
          c.write('\n_renegotiated\n');
          handleConnection(c);
        });
      }, 200);
      return;
    }
    if (c.authorized) {
      console.error(`${prefix}- authed connection: ${
        c.getPeerCertificate().subject.CN}`);
      c.write('\n_authed\n');
    } else {
      console.error(`${prefix}- unauthed connection: %s`, c.authorizationError);
      c.write('\n_unauthed\n');
    }
  });
  function runNextClient(clientIndex) {
    const options = tcase.clients[clientIndex];
    if (options) {
      runClient(`${prefix}${clientIndex} `, port, options, function() {
        runNextClient(clientIndex + 1);
      });
    } else {
      server.close();
      successfulTests++;
      runTest(0, nextTest++);
    }
  }
  server.listen(port, function() {
    port = server.address().port;
    if (tcase.debug) {
      console.error(`${prefix}TLS server running on port ${port}`);
    } else if (tcase.renegotiate) {
      runNextClient(0);
    } else {
      let clientsCompleted = 0;
      for (let i = 0; i < tcase.clients.length; i++) {
        runClient(`${prefix}${i} `, port, tcase.clients[i], function() {
          clientsCompleted++;
          if (clientsCompleted === tcase.clients.length) {
            server.close();
            successfulTests++;
            runTest(0, nextTest++);
          }
        });
      }
    }
  });
}
let nextTest = 0;
runTest(0, nextTest++);
process.on('exit', function() {
  assert.strictEqual(successfulTests, testCases.length);
});
