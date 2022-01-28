'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const net = require('net');
const kSettings = new http2util.SettingsFrame();
const kSettingsAck = new http2util.SettingsFrame(true);
const server = http2.createServer();
let client;
const countdown = new Countdown(3, () => {
  client.destroy();
  server.close();
});
server.on('stream', common.mustNotCall());
server.on('session', common.mustCall((session) => {
  session.on('remoteSettings', common.mustCall(() => countdown.dec()));
}));
server.listen(0, common.mustCall(() => {
  client = net.connect(server.address().port);
  client.once('data', (chunk) => {
    assert.deepStrictEqual(chunk.slice(0, 9), kSettings.data);
    client.write(kSettingsAck.data, () => countdown.dec());
    client.write(kSettingsAck.data, () => countdown.dec());
  });
  client.on('connect', common.mustCall(() => {
    client.write(http2util.kClientMagic);
    client.write(kSettings.data);
  }));
}));
