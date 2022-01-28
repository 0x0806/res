'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const net = require('net');
const kSettings = new http2util.SettingsFrame();
const kPingAck = new http2util.PingFrame(true);
const server = http2.createServer();
server.on('stream', common.mustNotCall());
server.on('session', common.mustCall((session) => {
  session.on('error', common.expectsError({
    code: 'ERR_HTTP2_ERROR',
    message: 'Protocol error'
  }));
  session.on('close', common.mustCall(() => server.close()));
}));
server.listen(0, common.mustCall(() => {
  const client = net.connect(server.address().port);
  client.on('connect', common.mustCall(() => {
    client.write(http2util.kClientMagic, () => {
      client.write(kSettings.data);
      client.write(kPingAck.data);
    });
  }));
  client.on('error', () => {});
}));
