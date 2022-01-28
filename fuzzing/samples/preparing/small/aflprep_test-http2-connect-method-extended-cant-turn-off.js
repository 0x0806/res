'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const settings = { enableConnectProtocol: true };
const server = http2.createServer({ settings });
server.on('stream', common.mustNotCall());
server.on('session', common.mustCall((session) => {
  session.settings({ enableConnectProtocol: false });
}));
server.listen(0, common.mustCall(() => {
  client.on('remoteSettings', common.mustCall((settings) => {
    assert(settings.enableConnectProtocol);
    const req = client.request({
      ':method': 'CONNECT',
      ':protocol': 'foo'
    });
    req.on('error', common.mustCall(() => {
      server.close();
    }));
  }));
}));
