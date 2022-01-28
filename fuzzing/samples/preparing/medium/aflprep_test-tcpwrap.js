'use strict';
if (!common.hasIPv6)
  common.skip('IPv6 support required');
const assert = require('assert');
const net = require('net');
let tcp1, tcp2;
let tcpserver;
let tcpconnect;
const hooks = initHooks();
hooks.enable();
const server = net
  .createServer(common.mustCall(onconnection))
  .on('listening', common.mustCall(onlistening));
{
  server.listen(0);
  const tcpsservers = hooks.activitiesOfTypes('TCPSERVERWRAP');
  const tcpconnects = hooks.activitiesOfTypes('TCPCONNECTWRAP');
  assert.strictEqual(tcpsservers.length, 1);
  assert.strictEqual(tcpconnects.length, 0);
  tcpserver = tcpsservers[0];
  assert.strictEqual(tcpserver.type, 'TCPSERVERWRAP');
  assert.strictEqual(typeof tcpserver.uid, 'number');
  assert.strictEqual(typeof tcpserver.triggerAsyncId, 'number');
  checkInvocations(tcpserver, { init: 1 }, 'when calling server.listen');
}
{
  net.connect(
    { port: server.address().port, host: '::1' },
    common.mustCall(onconnected));
  const tcps = hooks.activitiesOfTypes('TCPWRAP');
  assert.strictEqual(tcps.length, 1);
  process.nextTick(() => {
    const tcpconnects = hooks.activitiesOfTypes('TCPCONNECTWRAP');
    assert.strictEqual(tcpconnects.length, 1);
  });
  tcp1 = tcps[0];
  assert.strictEqual(tcps.length, 1);
  assert.strictEqual(tcp1.type, 'TCPWRAP');
  assert.strictEqual(typeof tcp1.uid, 'number');
  assert.strictEqual(typeof tcp1.triggerAsyncId, 'number');
  checkInvocations(tcpserver, { init: 1 },
                   'tcpserver when client is connecting');
  checkInvocations(tcp1, { init: 1 }, 'tcp1 when client is connecting');
}
function onlistening() {
  assert.strictEqual(hooks.activitiesOfTypes('TCPWRAP').length, 1);
}
function ontcpConnection(serverConnection) {
  if (tcpconnect != null) {
    const expected = serverConnection ?
      { init: 1, before: 1, after: 1 } :
      { init: 1, before: 1 };
    checkInvocations(
      tcpconnect, expected,
      'tcpconnect: when both client and server received connection');
    return;
  }
  const tcpconnects = hooks.activitiesOfTypes('TCPCONNECTWRAP');
  assert.strictEqual(tcpconnects.length, 1);
  tcpconnect = tcpconnects[0];
  assert.strictEqual(tcpconnect.type, 'TCPCONNECTWRAP');
  assert.strictEqual(typeof tcpconnect.uid, 'number');
  assert.strictEqual(typeof tcpconnect.triggerAsyncId, 'number');
  const expected = serverConnection ? { init: 1 } : { init: 1, before: 1 };
  checkInvocations(tcpconnect, expected,
                   'tcpconnect: when tcp connection is established');
}
let serverConnected = false;
function onconnected() {
  ontcpConnection(false);
  const expected = serverConnected ?
    { init: 1, before: 1, after: 1 } :
    { init: 1 };
  checkInvocations(tcpserver, expected, 'tcpserver when client connects');
  checkInvocations(tcp1, { init: 1 }, 'tcp1 when client connects');
}
function onconnection(c) {
  serverConnected = true;
  ontcpConnection(true);
  const tcps = hooks.activitiesOfTypes([ 'TCPWRAP' ]);
  const tcpconnects = hooks.activitiesOfTypes('TCPCONNECTWRAP');
  assert.strictEqual(tcps.length, 2);
  assert.strictEqual(tcpconnects.length, 1);
  tcp2 = tcps[1];
  assert.strictEqual(tcp2.type, 'TCPWRAP');
  assert.strictEqual(typeof tcp2.uid, 'number');
  assert.strictEqual(typeof tcp2.triggerAsyncId, 'number');
  checkInvocations(tcpserver, { init: 1, before: 1 },
                   'tcpserver when server receives connection');
  checkInvocations(tcp1, { init: 1 }, 'tcp1 when server receives connection');
  checkInvocations(tcp2, { init: 1 }, 'tcp2 when server receives connection');
  c.end();
  this.close(common.mustCall(onserverClosed));
}
function onserverClosed() {
  checkInvocations(tcpserver, { init: 1, before: 1, after: 1, destroy: 1 },
                   'tcpserver when server is closed');
  setImmediate(() => {
    checkInvocations(tcp1, { init: 1, before: 2, after: 2, destroy: 1 },
                     'tcp1 after server is closed');
  });
  checkInvocations(tcp2, { init: 1, before: 1, after: 1 },
                   'tcp2 synchronously when server is closed');
  tick(2, () => {
    checkInvocations(tcp2, { init: 1, before: 2, after: 2, destroy: 1 },
                     'tcp2 when server is closed');
    checkInvocations(tcpconnect, { init: 1, before: 1, after: 1, destroy: 1 },
                     'tcpconnect when server is closed');
  });
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck([ 'TCPWRAP', 'TCPSERVERWRAP', 'TCPCONNECTWRAP' ]);
  checkInvocations(tcpserver, { init: 1, before: 1, after: 1, destroy: 1 },
                   'tcpserver when process exits');
  checkInvocations(
    tcp1, { init: 1, before: 2, after: 2, destroy: 1 },
    'tcp1 when process exits');
  checkInvocations(
    tcp2, { init: 1, before: 2, after: 2, destroy: 1 },
    'tcp2 when process exits');
  checkInvocations(
    tcpconnect, { init: 1, before: 1, after: 1, destroy: 1 },
    'tcpconnect when process exits');
}
