'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const net = require('net');
const kSettings = new http2util.SettingsFrame();
const kPing = new http2util.PingFrame();
const server = http2.createServer();
let interval;
server.on('stream', common.mustNotCall());
server.on('session', common.mustCall((session) => {
  session.on('error', (e) => {
    assert.strictEqual(e.code, 'ERR_HTTP2_ERROR');
    assert(e.message.includes('Flooding was detected'));
    clearInterval(interval);
  });
  session.on('close', common.mustCall(() => {
    server.close();
  }));
}));
server.listen(0, common.mustCall(() => {
  const client = net.connect(server.address().port);
  client.on('connect', common.mustCall(() => {
    client.write(http2util.kClientMagic, () => {
      client.write(kSettings.data, () => {
        interval = setInterval(() => {
          for (let n = 0; n < 10000; n++)
            client.write(kPing.data);
        }, 1);
      });
    });
  }));
  client.on('error', () => {});
}));
