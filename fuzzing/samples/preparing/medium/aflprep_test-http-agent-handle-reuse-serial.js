'use strict';
const assert = require('assert');
const http = require('http');
const hooks = initHooks();
hooks.enable();
let asyncIdAtFirstReq;
let asyncIdAtSecondReq;
const agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: Infinity,
  maxSockets: 1
});
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
  }, common.mustCall((res) => {
    const socket = res.socket;
    asyncIdAtFirstReq = socket[async_id_symbol];
    assert.ok(asyncIdAtFirstReq > 0, `${asyncIdAtFirstReq} > 0`);
    assert.strictEqual(r1.socket, socket);
    res.on('data', common.mustCallAtLeast(() => {}));
    res.on('end', common.mustCall(() => {
      setImmediate(common.mustCall(() => {
        assert.strictEqual(socket[async_id_symbol], -1);
        const r2 = http.request({
          agent, port, method: 'POST', headers: {
            'Content-Length': payload.length
          }
        }, common.mustCall((res) => {
          asyncIdAtSecondReq = res.socket[async_id_symbol];
          assert.ok(asyncIdAtSecondReq > 0, `${asyncIdAtSecondReq} > 0`);
          assert.strictEqual(r2.socket, socket);
          r2.end('');
          res.on('data', common.mustCallAtLeast(() => {}));
          res.on('end', common.mustCall(() => {
            server.close();
            agent.destroy();
          }));
        }));
        r2.write(payload);
      }));
    }));
  }));
  r1.end(payload);
}));
process.on('exit', onExit);
function onExit() {
  hooks.disable();
  hooks.sanityCheck();
  const activities = hooks.activities;
  const first = activities.filter((x) => x.uid === asyncIdAtFirstReq)[0];
  checkInvocations(first, { init: 1, destroy: 1 }, 'when process exits');
  const second = activities.filter((x) => x.uid === asyncIdAtSecondReq)[0];
  checkInvocations(second, { init: 1, destroy: 1 }, 'when process exits');
  assert.strictEqual(first.type, second.type);
  assert.ok(first.handle !== second.handle, 'Resource reused');
}
