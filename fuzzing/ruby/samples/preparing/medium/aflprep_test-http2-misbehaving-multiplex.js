'use strict';
const assert = require('assert');
if (!common.hasCrypto)
  common.skip('missing crypto');
const h2 = require('http2');
const net = require('net');
let client;
const server = h2.createServer();
let gotFirstStreamId1;
server.on('stream', common.mustCall((stream) => {
  stream.respond();
  stream.end('ok');
  stream.on('error', () => {});
  stream.on('close', (err) => {
    if (stream.id === 1) {
      if (gotFirstStreamId1) {
        common.expectsError({
          constructor: NghttpError,
          code: 'ERR_HTTP2_ERROR',
          message: 'Stream was already closed or invalid'
        });
        return;
      }
      gotFirstStreamId1 = true;
    }
    assert.strictEqual(err, undefined);
  });
  assert.notStrictEqual(stream.id, 5);
}, 2));
server.on('session', common.mustCall((session) => {
  session.on('error', common.expectsError({
    code: 'ERR_HTTP2_ERROR',
    constructor: NghttpError,
    message: 'Stream was already closed or invalid'
  }));
}));
const settings = new h2test.SettingsFrame();
const settingsAck = new h2test.SettingsFrame(true);
const id1 = new h2test.HeadersFrame(1, h2test.kFakeRequestHeaders, 0, true);
const id3 = new h2test.HeadersFrame(3, h2test.kFakeRequestHeaders, 0, true);
const id5 = new h2test.HeadersFrame(5, h2test.kFakeRequestHeaders, 0, true);
server.listen(0, () => {
  client = net.connect(server.address().port, () => {
    client.write(h2test.kClientMagic, () => {
      client.write(settings.data, () => {
        client.write(settingsAck.data);
        client.write(id1.data, () => {
          client.write(id3.data, () => {
            client.write(id1.data, () => {
              client.write(id5.data);
            });
          });
        });
      });
    });
  });
  client.on('error', () => {});
  client.on('close', common.mustCall(() => server.close()));
  client.resume();
});
