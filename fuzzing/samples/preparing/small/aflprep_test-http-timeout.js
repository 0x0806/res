'use strict';
const http = require('http');
const MAX_COUNT = 11;
const server = http.createServer(common.mustCall(function(req, res) {
  res.end('OK');
}, MAX_COUNT));
const agent = new http.Agent({ maxSockets: 1 });
const countdown = new Countdown(MAX_COUNT, () => server.close());
server.listen(0, function() {
  for (let i = 0; i < MAX_COUNT; ++i) {
    createRequest().end();
  }
  function callback() {}
  function createRequest() {
    const req = http.request(
      function(res) {
        req.clearTimeout(callback);
        res.on('end', function() {
          countdown.dec();
        });
        res.resume();
      }
    );
    req.setTimeout(1000, callback);
    return req;
  }
});
