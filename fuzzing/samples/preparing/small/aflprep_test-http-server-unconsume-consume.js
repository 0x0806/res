'use strict';
const http = require('http');
const testServer = http.createServer(common.mustNotCall());
testServer.on('connect', common.mustCall((req, socket, head) => {
      'Proxy-agent: Node-Proxy\r\n' +
      '\r\n');
  testServer.emit('connection', socket);
  testServer.close();
}));
testServer.listen(0, common.mustCall(() => {
  http.request({
    port: testServer.address().port,
    method: 'CONNECT'
  }, (res) => {}).end();
}));
