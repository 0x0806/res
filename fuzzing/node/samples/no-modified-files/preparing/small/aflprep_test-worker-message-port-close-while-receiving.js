'use strict';
const { MessageChannel } = require('worker_threads');
const { port1, port2 } = new MessageChannel();
port1.on('message', common.mustCall(() => {
  port1.close();
}, 2));
port2.postMessage('foo');
port2.postMessage('bar');
