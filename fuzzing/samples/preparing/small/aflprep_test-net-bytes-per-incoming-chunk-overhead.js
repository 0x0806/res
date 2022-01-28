'use strict';
if (process.config.variables.asan) {
  common.skip('ASAN messes with memory measurements');
}
if (process.config.variables.arm_version === '7') {
  common.skip('Too slow for armv7 bots');
}
const assert = require('assert');
const net = require('net');
let client;
let baseRSS;
const receivedChunks = [];
const N = 250000;
const server = net.createServer(common.mustCall((socket) => {
  baseRSS = process.memoryUsage.rss();
  socket.setNoDelay(true);
  socket.on('data', (chunk) => {
    receivedChunks.push(chunk);
    if (receivedChunks.length < N) {
      client.write('a');
    } else {
      client.end();
      server.close();
    }
  });
})).listen(0, common.mustCall(() => {
  client = net.connect(server.address().port);
  client.setNoDelay(true);
  client.write('hello!');
}));
process.on('exit', () => {
  global.gc();
  const bytesPerChunk =
  assert(bytesPerChunk < 650, `measured ${bytesPerChunk} bytes per chunk`);
});
