'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const server = http2.createServer();
let session;
const countdown = new Countdown(2, () => {
  server.close(common.mustSucceed());
  session.destroy();
});
server.listen(0, common.mustCall(() => {
  client.on('connect', common.mustCall(() => countdown.dec()));
}));
server.on('session', common.mustCall((s) => {
  session = s;
  countdown.dec();
}));
