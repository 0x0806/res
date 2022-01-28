'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const http2 = require('http2');
let requests = 0;
const mustNotCall = () => {
  assert.fail(`Timeout after ${requests} request(s)`);
};
const server = http2.createServer();
server.timeout = 0;
server.on('request', (req, res) => res.end());
server.on('timeout', mustNotCall);
server.listen(0, common.mustCall(() => {
  const port = server.address().port;
  const client = http2.connect(url);
  let startTime = process.hrtime();
  makeReq();
  function makeReq() {
    const request = client.request({
      ':method': 'GET',
      ':scheme': 'http',
      ':authority': `localhost:${port}`,
    });
    request.resume();
    request.end();
    requests += 1;
    request.on('end', () => {
      const diff = process.hrtime(startTime);
      if (server.timeout === 0) {
        server.timeout = milliseconds * 2;
        startTime = process.hrtime();
        makeReq();
      } else if (milliseconds < server.timeout * 2) {
        makeReq();
      } else {
        server.removeListener('timeout', mustNotCall);
        server.close();
        client.close();
      }
    });
  }
}));
