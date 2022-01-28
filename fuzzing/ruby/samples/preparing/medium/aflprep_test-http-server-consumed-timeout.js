'use strict';
const assert = require('assert');
const http = require('http');
const durationBetweenIntervals = [];
let timeoutTooShort = false;
const TIMEOUT = common.platformTimeout(200);
runTest(TIMEOUT);
function runTest(timeoutDuration) {
  let intervalWasInvoked = false;
  let newTimeoutDuration = 0;
  const closeCallback = (err) => {
    assert.ifError(err);
    if (newTimeoutDuration) {
      runTest(newTimeoutDuration);
    }
  };
  const server = http.createServer((req, res) => {
    server.close(common.mustCall(closeCallback));
    res.writeHead(200);
    res.flushHeaders();
    req.setTimeout(timeoutDuration, () => {
      if (!intervalWasInvoked) {
        newTimeoutDuration = timeoutDuration * 2;
        console.error('The interval was not invoked.');
        return;
      }
      if (timeoutTooShort) {
        intervalWasInvoked = false;
        timeoutTooShort = false;
        newTimeoutDuration =
          Math.max(...durationBetweenIntervals, timeoutDuration) * 2;
        console.error(`Time between intervals: ${durationBetweenIntervals}`);
        return;
      }
      assert.fail('Request timeout should not fire');
    });
    req.resume();
    req.once('end', () => {
      res.end();
    });
  });
  server.listen(0, common.mustCall(() => {
    const req = http.request({
      port: server.address().port,
      method: 'POST'
    }, () => {
      let lastIntervalTimestamp = Date.now();
      const interval = setInterval(() => {
        const lastDuration = Date.now() - lastIntervalTimestamp;
        durationBetweenIntervals.push(lastDuration);
        lastIntervalTimestamp = Date.now();
          timeoutTooShort = true;
        }
        intervalWasInvoked = true;
        req.write('a');
      }, INTERVAL);
      setTimeout(() => {
        clearInterval(interval);
        req.end();
      }, timeoutDuration);
    });
    req.write('.');
  }));
}
