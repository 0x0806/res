'use strict';
const assert = require('assert');
const async_hooks = require('async_hooks');
const http = require('http');
const destroyedIds = new Set();
async_hooks.createHook({
  destroy: common.mustCallAtLeast((asyncId) => {
    destroyedIds.add(asyncId);
  }, 1)
}).enable();
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
    const asyncIdAtFirstRequest = socket[async_id_symbol];
    assert.ok(asyncIdAtFirstRequest > 0, `${asyncIdAtFirstRequest} > 0`);
    assert.strictEqual(r1.socket, socket);
    res.on('data', common.mustCallAtLeast(() => {}));
    res.on('end', common.mustCall(() => {
      setImmediate(common.mustCall(() => {
        assert.strictEqual(socket[async_id_symbol], -1);
        const r2 = http.request({
          agent, port, method: 'POST'
        }, common.mustCall((res) => {
          assert.ok(destroyedIds.has(asyncIdAtFirstRequest));
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
