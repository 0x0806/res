'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
const { PADDING_STRATEGY_ALIGNED, PADDING_STRATEGY_CALLBACK } = http2.constants;
{
  const server = http2.createServer({
    paddingStrategy: PADDING_STRATEGY_ALIGNED
  });
  server.on('stream', common.mustCall((stream, headers) => {
    stream.respond({
      ':status': 200
    });
    stream.end(testData);
  }));
  const { clientSide, serverSide } = makeDuplexPair();
  const serverLengths = [24, 9, 9, 32];
  const clientLengths = [9, 9, 48, 9, 1, 21, 1];
  assert.strictEqual(
    (serverLengths.reduce((i, n) => i + n) - 24 - 9 - 9) % 8, 0);
  assert.strictEqual(
    (clientLengths.reduce((i, n) => i + n) - 9 - 9) % 8, 0);
  serverSide.on('data', common.mustCall((chunk) => {
    assert.strictEqual(chunk.length, serverLengths.shift());
  }, serverLengths.length));
  clientSide.on('data', common.mustCall((chunk) => {
    assert.strictEqual(chunk.length, clientLengths.shift());
  }, clientLengths.length));
  server.emit('connection', serverSide);
    paddingStrategy: PADDING_STRATEGY_ALIGNED,
    createConnection: common.mustCall(() => clientSide)
  });
  req.on('response', common.mustCall());
  req.setEncoding('utf8');
  req.on('data', common.mustCall((data) => {
    assert.strictEqual(data, testData);
  }));
  req.on('close', common.mustCall(() => {
    clientSide.destroy();
    clientSide.end();
  }));
  req.end();
}
assert.strictEqual(PADDING_STRATEGY_ALIGNED, PADDING_STRATEGY_CALLBACK);
