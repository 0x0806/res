'use strict';
const assert = require('assert');
const http = require('http');
{
  const server = http.createServer(
    common.mustCall((req, res) => {
      res.end();
      server.close();
    })
  );
  server.listen(
    0,
    common.mustCall(() => {
      http.get(
        { hostname: 'localhost', port: server.address().port },
        common.mustCall((res) => {
          res.resume();
        })
      );
    })
  );
}
