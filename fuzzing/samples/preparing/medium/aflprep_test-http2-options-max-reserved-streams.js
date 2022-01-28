'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
const server = h2.createServer();
let client;
const countdown = new Countdown(3, () => {
  server.close();
  client.close();
});
server.on('stream', common.mustCall((stream) => {
  stream.pushStream({
  }, common.mustSucceed((pushedStream) => {
    pushedStream.respond();
    pushedStream.end();
    pushedStream.on('aborted', common.mustNotCall());
  }));
  stream.pushStream({
  }, common.mustSucceed((pushedStream) => {
    pushedStream.respond();
    pushedStream.on('aborted', common.mustCall());
    pushedStream.on('error', common.mustNotCall());
    pushedStream.on('close', common.mustCall(() => {
      assert.strictEqual(pushedStream.rstCode, 8);
      countdown.dec();
    }));
  }));
  stream.respond();
  stream.end('hello world');
}));
server.listen(0);
server.on('listening', common.mustCall(() => {
                      { maxReservedRemoteStreams: 1 });
  const req = client.request();
  client.on('stream', common.mustCall((stream) => {
    stream.resume();
    stream.on('push', common.mustCall());
    stream.on('end', common.mustCall());
    stream.on('close', common.mustCall(() => countdown.dec()));
  }));
  req.on('response', common.mustCall());
  req.resume();
  req.on('end', common.mustCall());
  req.on('close', common.mustCall(() => countdown.dec()));
}));
