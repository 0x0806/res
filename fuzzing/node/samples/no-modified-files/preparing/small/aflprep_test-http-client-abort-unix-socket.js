'use strict';
const http = require('http');
const server = http.createServer(common.mustNotCall());
class Agent extends http.Agent {
  createConnection(options, oncreate) {
    const socket = super.createConnection(options, oncreate);
    socket.once('close', () => server.close());
    return socket;
  }
}
tmpdir.refresh();
server.listen(common.PIPE, common.mustCall(() => {
  const req = http.get({
    agent: new Agent(),
    socketPath: common.PIPE
  });
  req.abort();
}));
