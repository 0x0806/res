'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const v8 = require('v8');
for (const variant of ['ping', 'settings']) {
  const server = http2.createServer();
  server.on('session', common.mustCall((session) => {
    if (variant === 'ping') {
      session.ping(common.expectsError({
        code: 'ERR_HTTP2_PING_CANCEL'
      }));
    } else {
      session.settings(undefined, common.mustNotCall());
    }
    session.on('close', common.mustCall(() => {
      v8.getHeapSnapshot().resume();
      server.close();
    }));
    session.destroy();
  }));
  server.listen(0, common.mustCall(() => {
                                 common.mustCall());
    client.on('error', (err) => {
      if (err.code !== 'ECONNRESET')
        throw err;
    });
  }));
}
