'use strict';
const assert = require('assert');
const http = require('http');
let name;
const max = 3;
const server = http.Server(common.mustCall((req, res) => {
    setTimeout(common.mustCall(() => {
      res.writeHead(200);
      res.end('Hello, World!');
    }), 100);
  } else {
    res.writeHead(200);
    res.end('Hello, World!');
  }
}, max));
server.listen(0, common.mustCall(() => {
  name = http.globalAgent.getName({ port: server.address().port });
  for (let i = 0; i < max; ++i)
    request(i);
}));
const countdown = new Countdown(max, () => {
  assert(!(name in http.globalAgent.sockets));
  assert(!(name in http.globalAgent.requests));
  server.close();
});
function request(i) {
  const req = http.get({
    port: server.address().port,
  }, function(res) {
    const socket = req.socket;
    socket.on('close', common.mustCall(() => {
      countdown.dec();
      if (countdown.remaining > 0) {
        assert.strictEqual(http.globalAgent.sockets[name].includes(socket),
                           false);
      }
    }));
    res.resume();
  });
}
