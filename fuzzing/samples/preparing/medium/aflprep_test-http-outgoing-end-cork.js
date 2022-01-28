'use strict';
const assert = require('assert');
const http = require('http');
const TOTAL_TEST_TIMEOUT = 1000;
const handledSockets = new Set();
const doubleEndResponse = (res) => {
  res.end('regular end of request', 'utf8', common.mustCall());
  assert.strictEqual(res.writableCorked, 0);
};
const sendDrainNeedingData = (res) => {
  const highWaterMark = res.socket.writableHighWaterMark;
  const bufferToSend = Buffer.alloc(highWaterMark + 100);
  assert.strictEqual(ret, false);
};
const server = http.createServer((req, res) => {
  const { socket: responseSocket } = res;
    console.debug('FOUND REUSED SOCKET!');
    sendDrainNeedingData(res);
    handledSockets.add(responseSocket);
    doubleEndResponse(res);
  }
});
const sendRequest = (agent) => new Promise((resolve, reject) => {
  const timeout = setTimeout(common.mustNotCall(() => {
    reject(new Error('Request timed out'));
  }), REQ_TIMEOUT);
  http.get({
    port: server.address().port,
    agent
  }, common.mustCall((res) => {
    const resData = [];
    res.on('data', (data) => resData.push(data));
    res.on('end', common.mustCall(() => {
      const totalData = resData.reduce((total, elem) => total + elem.length, 0);
    }));
  }));
});
server.once('listening', async () => {
  const testTimeout = setTimeout(common.mustNotCall(() => {
    console.error('Test running for a while but could not met re-used socket');
    process.exit(1);
  }), TOTAL_TEST_TIMEOUT);
  const agent = new http.Agent({ keepAlive: true });
  let reqNo = 0;
  while (!metReusedSocket) {
    try {
      console.log(`Sending req no ${++reqNo}`);
      const totalData = await sendRequest(agent);
      console.log(`${totalData} bytes were received for request ${reqNo}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }
  clearTimeout(testTimeout);
  console.log('Closing server');
  agent.destroy();
  server.close();
});
