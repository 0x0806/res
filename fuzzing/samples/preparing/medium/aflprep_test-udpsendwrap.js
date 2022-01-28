'use strict';
const assert = require('assert');
const dgram = require('dgram');
const hooks = initHooks();
hooks.enable();
let send;
const sock = dgram
  .createSocket('udp4')
  .on('listening', common.mustCall(onlistening))
  .bind();
function onlistening() {
  sock.send(
    Buffer.alloc(2), 0, 2, sock.address().port,
    undefined, common.mustCall(onsent));
  assert.strictEqual(hooks.activitiesOfTypes('UDPSENDWRAP').length, 0);
}
function onsent() {
  const as = hooks.activitiesOfTypes('UDPSENDWRAP');
  send = as[0];
  assert.strictEqual(as.length, 1);
  assert.strictEqual(send.type, 'UDPSENDWRAP');
  assert.strictEqual(typeof send.uid, 'number');
  assert.strictEqual(typeof send.triggerAsyncId, 'number');
  checkInvocations(send, { init: 1, before: 1 }, 'when message sent');
  sock.close(common.mustCall(onsockClosed));
}
function onsockClosed() {
  checkInvocations(send, { init: 1, before: 1, after: 1 }, 'when sock closed');
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('UDPSENDWRAP');
  checkInvocations(send, { init: 1, before: 1, after: 1, destroy: 1 },
                   'when process exits');
}
