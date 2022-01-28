'use strict';
const assert = require('assert');
const { MessageChannel } = require('worker_threads');
const { port1, port2 } = new MessageChannel();
let count = 0;
port1.on('message', () => {
  if (count === 0) {
    setTimeout(common.mustCall(() => {
      port1.close();
    }), 0);
  }
  port2.postMessage(0);
  assert(count++ < 10000, `hit ${count} loop iterations`);
});
port2.postMessage(0);
setTimeout(common.mustCall(), 0);
