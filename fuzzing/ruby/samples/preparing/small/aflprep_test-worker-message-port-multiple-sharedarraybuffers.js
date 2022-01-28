'use strict';
const assert = require('assert');
const { MessageChannel } = require('worker_threads');
const obj = [
  [ new SharedArrayBuffer(0), new SharedArrayBuffer(1) ],
  [ new SharedArrayBuffer(2), new SharedArrayBuffer(3) ],
];
const { port1, port2 } = new MessageChannel();
port1.once('message', common.mustCall((message) => {
  assert.deepStrictEqual(message, obj);
}));
port2.postMessage(obj);
