'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const http2 = require('http2');
const net = require('net');
const { Worker, parentPort } = require('worker_threads');
if (process.env.HAS_STARTED_WORKER) {
  const server = http2.createServer({ maxSessionInvalidFrames: 100 });
  server.on('stream', (stream) => {
    stream.respond({
      ':status': 200
    });
    stream.end('Hello, world!\n');
  });
  server.listen(0, () => parentPort.postMessage(server.address().port));
  return;
}
process.env.HAS_STARTED_WORKER = 1;
const worker = new Worker(__filename).on('message', common.mustCall((port) => {
  const h2header = Buffer.alloc(9);
  const conn = net.connect({ port, allowHalfOpen: true });
  conn.write(Buffer.from(h2header));
  let inbuf = Buffer.alloc(0);
  let state = 'settingsHeader';
  let settingsFrameLength;
  conn.on('data', (chunk) => {
    inbuf = Buffer.concat([inbuf, chunk]);
    switch (state) {
      case 'settingsHeader':
        if (inbuf.length < 9) return;
        settingsFrameLength = inbuf.readIntBE(0, 3);
        inbuf = inbuf.slice(9);
        state = 'readingSettings';
      case 'readingSettings':
        if (inbuf.length < settingsFrameLength) return;
        inbuf = inbuf.slice(settingsFrameLength);
        h2header[4] = 1;
        conn.write(Buffer.from(h2header));
        state = 'ignoreInput';
        writeRequests();
    }
  });
  let gotError = false;
  let streamId = 1;
  function writeRequests() {
    for (let i = 1; i < 10 && !gotError; i++) {
      streamId += 2;
      if (!conn.write(Buffer.concat([h2header, Buffer.from([0x88])]))) {
        break;
      }
    }
    if (!gotError)
      setImmediate(writeRequests);
  }
  conn.once('error', common.mustCall(() => {
    gotError = true;
    worker.terminate();
    conn.destroy();
  }));
}));
