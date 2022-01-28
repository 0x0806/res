'use strict';
const http = require('http');
const s = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Length': '0 ' });
  res.end();
});
s.listen(0, function() {
  const request = http.request({ port: this.address().port }, (response) => {
    console.log(`STATUS: ${response.statusCode}`);
    s.close();
    response.resume();
  });
  request.end();
});
