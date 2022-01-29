'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createServer();
server.on('stream', common.mustNotCall());
let test = 0;
server.on('session', common.mustCall((session) => {
  switch (++test) {
    case 1:
      server.on('error', common.mustNotCall());
      session.on('error', common.expectsError({
        name: 'Error',
        message: 'test'
      }));
      session[kSocket].emit('error', new Error('test'));
      break;
    case 2:
      session[kSocket].emit('error', new Error('test'));
      break;
  }
}, 2));
server.listen(0, common.mustCall(() => {
  http2.connect(url)
    .on('error', common.expectsError({
      code: 'ERR_HTTP2_SESSION_ERROR',
      message: 'Session closed with error code 2',
    }))
    .on('close', () => {
      server.removeAllListeners('error');
      http2.connect(url)
        .on('error', common.expectsError({
          code: 'ERR_HTTP2_SESSION_ERROR',
          message: 'Session closed with error code 2',
        }))
        .on('close', () => server.close());
    });
}));
