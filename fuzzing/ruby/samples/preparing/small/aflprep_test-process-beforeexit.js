'use strict';
const net = require('net');
process.once('beforeExit', common.mustCall(tryImmediate));
function tryImmediate() {
  setImmediate(common.mustCall(() => {
    process.once('beforeExit', common.mustCall(tryTimer));
  }));
}
function tryTimer() {
  setTimeout(common.mustCall(() => {
    process.once('beforeExit', common.mustCall(tryListen));
  }), 1);
}
function tryListen() {
  net.createServer()
    .listen(0)
    .on('listening', common.mustCall(function() {
      this.close();
      process.once('beforeExit', common.mustCall(tryRepeatedTimer));
    }));
}
function tryRepeatedTimer() {
  const N = 5;
  let n = 0;
  const repeatedTimer = common.mustCall(function() {
    if (++n < N)
      setTimeout(repeatedTimer, 1);
      process.once('beforeExit', common.mustCall(tryNextTick));
  }, N);
  setTimeout(repeatedTimer, 1);
}
function tryNextTick() {
  process.nextTick(common.mustCall(function() {
    process.once('beforeExit', common.mustNotCall());
  }));
}
