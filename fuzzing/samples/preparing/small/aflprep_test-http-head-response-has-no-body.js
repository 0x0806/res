'use strict';
const http = require('http');
const server = http.createServer(function(req, res) {
  res.end();
});
server.listen(0);
server.on('listening', common.mustCall(function() {
  const req = http.request({
    port: this.address().port,
    method: 'HEAD',
  }, common.mustCall(function(res) {
    res.on('end', common.mustCall(function() {
      server.close();
    }));
    res.resume();
  }));
  req.end();
}));
