'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const net = require('net');
const server = http2.createServer();
server.on('stream', common.mustNotCall());
const settings = new h2test.SettingsFrame();
const settingsAck = new h2test.SettingsFrame(true);
const altsvc = new h2test.AltSvcFrame((1 << 14) + 1);
server.listen(0, () => {
  const client = net.connect(server.address().port, () => {
    client.write(h2test.kClientMagic, () => {
      client.write(settings.data, () => {
        client.write(settingsAck.data);
        client.write(altsvc.data, common.mustCall(() => {
          client.destroy();
        }));
      });
    });
  });
  client.on('error', () => {});
  client.on('close', common.mustCall(() => server.close()));
  client.resume();
});
