'use strict';
const http = require('http');
const body = 'hello world\n';
function test(headers) {
  const server = http.createServer(function(req, res) {
    console.error('req: %s headers: %j', req.method, headers);
    res.writeHead(200, headers);
    res.end();
    server.close();
  });
  server.listen(0, common.mustCall(function() {
    const request = http.request({
      port: this.address().port,
      method: 'HEAD',
    }, common.mustCall(function(response) {
      console.error('response start');
      response.on('end', common.mustCall(function() {
        console.error('response end');
      }));
      response.resume();
    }));
    request.end();
  }));
}
test({
  'Transfer-Encoding': 'chunked'
});
test({
  'Content-Length': body.length
});
