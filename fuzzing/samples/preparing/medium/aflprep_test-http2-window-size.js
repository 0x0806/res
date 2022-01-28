'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const h2 = require('http2');
function run(buffers, initialWindowSize) {
  return new Promise((resolve, reject) => {
    const expectedBuffer = Buffer.concat(buffers);
    const server = h2.createServer();
    server.on('stream', (stream) => {
      let i = 0;
      const writeToStream = () => {
        const cont = () => {
          i++;
          if (i < buffers.length) {
            setImmediate(writeToStream);
          } else {
            stream.end();
          }
        };
        const drained = stream.write(buffers[i]);
        if (drained) {
          cont();
        } else {
          stream.once('drain', cont);
        }
      };
      writeToStream();
    });
    server.listen(0);
    server.on('listening', common.mustCall(function() {
      const port = this.address().port;
      const client =
        h2.connect({
          authority: 'localhost',
          protocol: 'http:',
          port
        }, {
          settings: {
            initialWindowSize
          }
        }).on('connect', common.mustCall(() => {
          const req = client.request({
            ':method': 'GET',
          });
          const responses = [];
          req.on('data', (data) => {
            responses.push(data);
          });
          req.on('end', common.mustCall(() => {
            const actualBuffer = Buffer.concat(responses);
            assert.strictEqual(Buffer.compare(actualBuffer, expectedBuffer), 0);
            client.close();
            server.close(() => {
              resolve();
            });
          }));
          req.end();
        }));
    }));
  });
}
const bufferValueRange = [0, 1, 2, 3];
const buffersList = [
  bufferValueRange.map((a) => Buffer.alloc(1 << 4, a)),
  bufferValueRange.map((a) => Buffer.alloc((1 << 8) - 1, a)),
];
const initialWindowSizeList = [
  1 << 4,
  (1 << 8) - 1,
  1 << 8,
  1 << 17,
];
let p = Promise.resolve();
for (const buffers of buffersList) {
  for (const initialWindowSize of initialWindowSizeList) {
    p = p.then(() => run(buffers, initialWindowSize));
  }
}
p.then(common.mustCall(() => {}));
