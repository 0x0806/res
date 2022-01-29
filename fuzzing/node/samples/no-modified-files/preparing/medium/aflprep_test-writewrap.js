'use strict';
const assert = require('assert');
const net = require('net');
const hooks = initHooks();
hooks.enable();
const server = net.createServer()
  .on('listening', common.mustCall(onlistening))
  .on('connection', common.mustCall(onconnection))
  .listen(0);
assert.strictEqual(hooks.activitiesOfTypes('WRITEWRAP').length, 0);
function onlistening() {
  assert.strictEqual(hooks.activitiesOfTypes('WRITEWRAP').length, 0);
  net
    .connect(server.address().port)
    .on('connect', common.mustCall(onconnect));
  assert.strictEqual(hooks.activitiesOfTypes('WRITEWRAP').length, 0);
}
function checkDestroyedWriteWraps(n, stage) {
  const as = hooks.activitiesOfTypes('WRITEWRAP');
  assert.strictEqual(as.length, n,
                     `${as.length} out of ${n} WRITEWRAPs when ${stage}`);
  function checkValidWriteWrap(w) {
    assert.strictEqual(w.type, 'WRITEWRAP');
    assert.strictEqual(typeof w.uid, 'number');
    assert.strictEqual(typeof w.triggerAsyncId, 'number');
    checkInvocations(w, { init: 1 }, `when ${stage}`);
  }
  as.forEach(checkValidWriteWrap);
}
function onconnection(conn) {
  conn.resume();
  checkDestroyedWriteWraps(0, 'server got connection');
}
function onconnect() {
  checkDestroyedWriteWraps(0, 'client connected');
  this.once('data', common.mustCall(ondata));
}
function ondata() {
  const write = () => {
    let writeFinished = false;
    this.write('f'.repeat(1280000), () => {
      writeFinished = true;
    });
    process.nextTick(() => {
      if (writeFinished) {
        writeFinished = false;
        write();
      } else {
        onafterwrite(this);
      }
    });
  };
  write();
}
function onafterwrite(self) {
  checkDestroyedWriteWraps(1, 'client destroyed');
  self.end();
  checkDestroyedWriteWraps(1, 'client destroyed');
  server.close(common.mustCall(onserverClosed));
  checkDestroyedWriteWraps(1, 'server closing');
}
function onserverClosed() {
  checkDestroyedWriteWraps(1, 'server closed');
}
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  hooks.sanityCheck('WRITEWRAP');
  checkDestroyedWriteWraps(1, 'process exits');
}
