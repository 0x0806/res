'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const assert = require('assert');
const fs = require('fs');
const hooks = initHooks();
hooks.enable();
const {
  HTTP2_HEADER_CONTENT_TYPE
} = http2.constants;
const fname = fixtures.path('person-large.jpg');
const fd = fs.openSync(fname, 'r');
const server = http2.createServer();
server.on('stream', (stream) => {
  stream.respondWithFD(fd, {
  });
});
server.on('close', common.mustCall(() => fs.closeSync(fd)));
server.listen(0, () => {
  const req = client.request();
  req.on('response', common.mustCall());
  req.on('data', () => {});
  req.on('end', common.mustCall(() => {
    client.close();
    server.close();
  }));
  req.end();
});
process.on('exit', onExit);
function onExit() {
  hooks.disable();
  hooks.sanityCheck();
  const activities = hooks.activities;
  const fsReqs = activities.filter((x) => x.type === 'FSREQCALLBACK');
  assert.ok(fsReqs.length >= 2);
  checkInvocations(fsReqs[0], { init: 1, destroy: 1 }, 'when process exits');
  checkInvocations(fsReqs[1], { init: 1, destroy: 1 }, 'when process exits');
  assert.ok(fsReqs[0].handle !== fsReqs[1].handle, 'Resource reused');
  assert.ok(fsReqs[0].handle === fsReqs[1].handle.handle,
            'Resource not wrapped correctly');
}
