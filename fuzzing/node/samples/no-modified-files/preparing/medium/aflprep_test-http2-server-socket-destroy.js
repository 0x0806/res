'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
server.on('stream', common.mustCall(onStream));
function onStream(stream) {
  stream.respond();
  stream.write('test');
  const socket = stream.session[kSocket];
  socket.on('close', common.mustCall());
  stream.on('close', common.mustCall());
  server.on('close', common.mustCall());
  stream.session.on('close', common.mustCall(() => server.close()));
  stream.on('aborted', common.mustCall());
  assert.notStrictEqual(stream.session, undefined);
  socket.destroy();
}
server.listen(0);
server.on('listening', common.mustCall(() => {
  client.on('error', (err) => {
    if (err.code !== 'ECONNRESET')
      throw err;
  });
  client.on('close', common.mustCall());
  const req = client.request({ ':method': 'POST' });
  req.on('error', (err) => {
    if (err.code !== 'ECONNRESET')
      throw err;
  });
  req.on('aborted', common.mustCall());
  req.resume();
  req.on('end', common.mustCall());
}));
