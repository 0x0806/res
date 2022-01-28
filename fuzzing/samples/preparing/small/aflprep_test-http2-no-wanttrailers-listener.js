'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustCall(onStream));
function onStream(stream, headers, flags) {
  stream.respond(undefined, { waitForTrailers: true });
  stream.end('ok');
}
server.listen(0);
server.on('listening', common.mustCall(function() {
  const req = client.request();
  req.resume();
  req.on('trailers', common.mustNotCall());
  req.on('close', common.mustCall(() => {
    server.close();
    client.close();
  }));
}));
