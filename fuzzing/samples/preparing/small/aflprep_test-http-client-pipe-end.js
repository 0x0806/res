'use strict';
const http = require('http');
const server = http.createServer(function(req, res) {
  req.resume();
  req.once('end', function() {
    res.writeHead(200);
    res.end();
    server.close();
  });
});
tmpdir.refresh();
server.listen(common.PIPE, function() {
  const req = http.request({
    socketPath: common.PIPE,
    headers: { 'Content-Length': '1' },
    method: 'POST',
  });
  req.write('.');
  sched(function() { req.end(); }, 5);
});
function sched(cb, ticks) {
  function fn() {
    if (--ticks)
      setImmediate(fn);
    else
      cb();
  }
  setImmediate(fn);
}
