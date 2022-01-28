'use strict';
const assert = require('assert');
const http = require('http');
const testResBody = 'other stuff!\n';
const server = http.createServer((req, res) => {
  assert.ok(!('date' in req.headers),
            'Request headers contained a Date.');
  res.writeHead(200, {
  });
  res.end(testResBody);
});
server.listen(0);
server.addListener('listening', () => {
  const options = {
    port: server.address().port,
    method: 'GET'
  };
  const req = http.request(options, (res) => {
    assert.ok('date' in res.headers,
              'Response headers didn\'t contain a Date.');
    res.addListener('end', () => {
      server.close();
    });
    res.resume();
  });
  req.end();
});
