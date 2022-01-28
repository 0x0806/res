'use strict';
const assert = require('assert');
const http = require('http');
const N = 4;
const M = 4;
const server = http.Server(common.mustCall(function(req, res) {
  res.writeHead(200);
  res.end('hello world\n');
function makeRequests(outCount, inCount, shouldFail) {
  const countdown = new Countdown(
    outCount * inCount,
    common.mustCall(() => server.close())
  );
  const p = new Promise((resolve) => {
    onRequest = common.mustCall((res) => {
      if (countdown.dec() === 0) {
        resolve();
      }
      if (!shouldFail)
        res.resume();
    }, outCount * inCount);
  });
  server.listen(0, () => {
    const port = server.address().port;
    for (let i = 0; i < outCount; i++) {
      setTimeout(() => {
        for (let j = 0; j < inCount; j++) {
          if (shouldFail)
            req.on('error', common.mustCall(onRequest));
          else
            req.on('error', (e) => assert.fail(e));
        }
      }, i);
    }
  });
  return p;
}
const test1 = makeRequests(N, M);
const test2 = () => {
  http.Agent.prototype.createConnection = function createConnection(_, cb) {
    process.nextTick(cb, new Error('nothing'));
  };
  return makeRequests(N, M, true);
};
test1
  .then(test2)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }
  );
