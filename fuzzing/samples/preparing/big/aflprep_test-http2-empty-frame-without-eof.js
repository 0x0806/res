'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const net = require('net');
const http2 = require('http2');
const { once } = require('events');
async function main() {
  const blobWithEmptyFrame = readSync('emptyframe.http2');
  const server = net.createServer((socket) => {
    socket.end(blobWithEmptyFrame);
  }).listen(0);
  await once(server, 'listening');
  for (const maxSessionInvalidFrames of [0, 2]) {
      maxSessionInvalidFrames
    });
    const stream = client.request({
      ':method': 'GET',
    });
    if (maxSessionInvalidFrames) {
      stream.on('error', common.mustNotCall());
      client.on('error', common.mustNotCall());
    } else {
      const expected = {
        code: 'ERR_HTTP2_TOO_MANY_INVALID_FRAMES',
      };
      stream.on('error', common.expectsError(expected));
      client.on('error', common.expectsError(expected));
    }
    stream.resume();
    await once(stream, 'end');
    client.close();
  }
  server.close();
}
main().then(common.mustCall());
