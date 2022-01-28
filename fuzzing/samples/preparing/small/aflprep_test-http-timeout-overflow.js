'use strict';
const http = require('http');
const server = http.createServer(common.mustCall(function(req, res) {
  res.end('OK');
}));
server.listen(0, function() {
  function callback() {}
  const req = http.request({
    port: this.address().port,
    agent: false
  }, function(res) {
    req.clearTimeout(callback);
    res.on('end', common.mustCall(function() {
      server.close();
    }));
    res.resume();
  });
  req.setTimeout(0xffffffff, callback);
  req.end();
});
