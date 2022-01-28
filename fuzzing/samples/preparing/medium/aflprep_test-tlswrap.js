'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const tls = require('tls');
const hooks = initHooks();
hooks.enable();
tls.DEFAULT_MAX_VERSION = 'TLSv1.2';
const server = tls
  .createServer({
    cert: fixtures.readKey('rsa_cert.crt'),
    key: fixtures.readKey('rsa_private.pem')
  })
  .on('listening', common.mustCall(onlistening))
  .on('secureConnection', common.mustCall(onsecureConnection))
  .listen(0);
let svr, client;
function onlistening() {
  tls
    .connect(server.address().port, { rejectUnauthorized: false })
    .on('secureConnect', common.mustCall(onsecureConnect));
  const as = hooks.activitiesOfTypes('TLSWRAP');
  assert.strictEqual(as.length, 1);
  svr = as[0];
  assert.strictEqual(svr.type, 'TLSWRAP');
  assert.strictEqual(typeof svr.uid, 'number');
  assert.strictEqual(typeof svr.triggerAsyncId, 'number');
  checkInvocations(svr, { init: 1 }, 'server: when client connecting');
}
function onsecureConnection() {
  const as = hooks.activitiesOfTypes('TLSWRAP');
  assert.strictEqual(as.length, 2);
  client = as[1];
  assert.strictEqual(client.type, 'TLSWRAP');
  assert.strictEqual(typeof client.uid, 'number');
  assert.strictEqual(typeof client.triggerAsyncId, 'number');
  checkInvocations(svr, { init: 1, before: 1, after: 1 },
                   'server: when server has secure connection');
  checkInvocations(client, { init: 1, before: 2, after: 1 },
                   'client: when server has secure connection');
}
function onsecureConnect() {
  checkInvocations(svr, { init: 1, before: 2, after: 1 },
                   'server: when client connected');
  checkInvocations(client, { init: 1, before: 2, after: 2 },
                   'client: when client connected');
  checkInvocations(svr, { init: 1, before: 2, after: 1 },
                   'server: when destroying client');
  checkInvocations(client, { init: 1, before: 2, after: 2 },
                   'client: when destroying client');
  tick(5, tick1);
  function tick1() {
    checkInvocations(svr, { init: 1, before: 2, after: 2 },
                     'server: when client destroyed');
    if (client.before.length < 3) {
      tick(5, tick1);
      return;
    }
    checkInvocations(client, { init: 1, before: 3, after: 3 },
                     'client: when client destroyed');
    server.close(common.mustCall(onserverClosed));
    checkInvocations(svr, { init: 1, before: 2, after: 2 },
                     'server: when closing server');
    checkInvocations(client, { init: 1, before: 3, after: 3 },
                     'client: when closing server');
  }
}
function onserverClosed() {
  tick(1E4, common.mustCall(() => {
    checkInvocations(svr, { init: 1, before: 2, after: 2 },
                     'server: when server closed');
    checkInvocations(client, { init: 1, before: 3, after: 3 },
                     'client: when server closed');
  }));
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('TLSWRAP');
  checkInvocations(svr, { init: 1, before: 2, after: 2 },
                   'server: when process exits');
  checkInvocations(client, { init: 1, before: 3, after: 3 },
                   'client: when process exits');
}
