'use strict';
const { Agent, get } = require('http');
const { strictEqual } = require('assert');
const request = get({
  agent: new Agent({ timeout: 50 }),
  lookup: () => {},
  timeout: 100
});
request.on('socket', mustCall((socket) => {
  strictEqual(socket.timeout, 100);
  const listeners = socket.listeners('timeout');
  strictEqual(listeners.length, 2);
  strictEqual(listeners[1], request.timeoutCb);
}));
