'use strict';
const { strictEqual } = require('assert');
const { Agent, get } = require('http');
const request = get({
  agent: new Agent({ timeout: 50 }),
  lookup: () => {}
});
request.on('socket', mustCall((socket) => {
  strictEqual(socket.timeout, 50);
  const listeners = socket.listeners('timeout');
  strictEqual(listeners.length, 2);
  strictEqual(listeners[1], request.timeoutCb);
}));
