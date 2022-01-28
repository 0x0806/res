'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createServer({ maxSettings: 1 });
server.on('session', common.mustCall((session) => {
  session.on('stream', common.mustNotCall());
  session.on('remoteSettings', common.mustNotCall());
}));
server.on('stream', common.mustNotCall());
server.listen(0, common.mustCall(() => {
  const client = http2.connect(
      settings: {
        headerTableSize: 1000,
        enablePush: false,
      },
    });
  client.on('error', common.mustCall(() => {
    server.close();
  }));
}));
