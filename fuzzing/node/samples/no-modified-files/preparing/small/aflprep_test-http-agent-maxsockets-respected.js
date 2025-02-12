'use strict';
const assert = require('assert');
const http = require('http');
const MAX_SOCKETS = 2;
const agent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: MAX_SOCKETS,
  maxFreeSockets: 2
});
const server = http.createServer(
  common.mustCall((req, res) => {
    res.end('hello world');
  }, 6)
);
const countdown = new Countdown(6, () => server.close());
function get(path, callback) {
  return http.get(
    {
      host: 'localhost',
      port: server.address().port,
      agent: agent,
      path: path
    },
    callback
  );
}
server.listen(
  0,
  common.mustCall(() => {
    for (let i = 0; i < 6; i++) {
      request.on(
        'response',
        common.mustCall(() => {
          request.abort();
          const sockets = agent.sockets[Object.keys(agent.sockets)[0]];
          assert(sockets.length <= MAX_SOCKETS);
          countdown.dec();
        })
      );
    }
  })
);
