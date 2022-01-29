'use strict';
const assert = require('assert');
const http = require('http');
const hooks = initHooks();
hooks.enable();
const reqAsyncIds = [];
let socket;
let responses = 0;
const agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: Infinity,
  maxSockets: 1
});
const verifyRequest = (idx) => (res) => {
  reqAsyncIds[idx] = res.socket[async_id_symbol];
  assert.ok(reqAsyncIds[idx] > 0, `${reqAsyncIds[idx]} > 0`);
  if (socket) {
    assert.strictEqual(res.socket, socket);
  } else {
    socket = res.socket;
  }
  res.on('data', common.mustCallAtLeast(() => {}));
  res.on('end', common.mustCall(() => {
    if (++responses === 2) {
      server.close();
      agent.destroy();
    }
  }));
};
const server = http.createServer(common.mustCall((req, res) => {
  req.once('data', common.mustCallAtLeast(() => {
    res.write('foo');
  }));
  req.on('end', common.mustCall(() => {
    res.end('bar');
  }));
}, 2)).listen(0, common.mustCall(() => {
  const port = server.address().port;
  const payload = 'hello world';
  const r1 = http.request({
    agent, port, method: 'POST'
  }, common.mustCall(verifyRequest(0)));
  r1.end(payload);
  const r2 = http.request({
    agent, port, method: 'POST'
  }, common.mustCall(verifyRequest(1)));
  r2.end(payload);
}));
process.on('exit', onExit);
function onExit() {
  hooks.disable();
  hooks.sanityCheck();
  const activities = hooks.activities;
  const first = activities.filter((x) => x.uid === reqAsyncIds[0])[0];
  checkInvocations(first, { init: 1, destroy: 1 }, 'when process exits');
  const second = activities.filter((x) => x.uid === reqAsyncIds[1])[0];
  checkInvocations(second, { init: 1, destroy: 1 }, 'when process exits');
  assert.strictEqual(first.type, second.type);
  assert.ok(first.handle !== second.handle, 'Resource reused');
}
