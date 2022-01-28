'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
const http = require('http');
const N = 50;
const KEEP_ALIVE = 100;
const createdIdsIncomingMessage = [];
const createdIdsClientRequest = [];
const destroyedIdsIncomingMessage = [];
const destroyedIdsClientRequest = [];
async_hooks.createHook({
  init: (asyncId, type) => {
    if (type === 'HTTPINCOMINGMESSAGE') {
      createdIdsIncomingMessage.push(asyncId);
    }
    if (type === 'HTTPCLIENTREQUEST') {
      createdIdsClientRequest.push(asyncId);
    }
  },
  destroy: (asyncId) => {
    if (createdIdsIncomingMessage.includes(asyncId)) {
      destroyedIdsIncomingMessage.push(asyncId);
    }
    if (createdIdsClientRequest.includes(asyncId)) {
      destroyedIdsClientRequest.push(asyncId);
    }
    if (destroyedIdsClientRequest.length === N && keepAliveAgent) {
      keepAliveAgent.destroy();
      keepAliveAgent = undefined;
    }
    if (destroyedIdsIncomingMessage.length === N && server.listening) {
      server.close();
    }
  }
}).enable();
const server = http.createServer((req, res) => {
  req.on('close', common.mustCall(() => {
    req.on('readable', common.mustNotCall());
  }));
  res.end('Hello');
});
let keepAliveAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: KEEP_ALIVE,
});
server.listen(0, () => {
  for (let i = 0; i < N; ++i) {
    (function makeRequest() {
      http.get({
        port: server.address().port,
        agent: keepAliveAgent
      }, (res) => {
        res.resume();
      });
    })();
  }
});
function checkOnExit() {
  assert.strictEqual(createdIdsIncomingMessage.length, N);
  assert.strictEqual(createdIdsClientRequest.length, N);
  assert.strictEqual(destroyedIdsIncomingMessage.length, N);
  assert.strictEqual(destroyedIdsClientRequest.length, N);
  assert.deepStrictEqual(destroyedIdsIncomingMessage.sort(),
                         createdIdsIncomingMessage.sort());
  assert.deepStrictEqual(destroyedIdsClientRequest.sort(),
                         createdIdsClientRequest.sort());
}
process.on('SIGTERM', () => {
  process.exit(1);
});
process.on('exit', checkOnExit);
