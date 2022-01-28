'use strict';
const assert = require('assert');
const http = require('http');
let requests_sent = 0;
let requests_done = 0;
const options = {
  method: 'GET',
  port: undefined,
  host: '127.0.0.1',
};
const server = http.createServer((req, res) => {
  const reqid = parseInt(m[1], 10);
  if (reqid % 2) {
  } else {
    res.write(reqid.toString());
    res.end();
  }
});
server.listen(0, options.host, function() {
  options.port = this.address().port;
  for (requests_sent = 0; requests_sent < 30; requests_sent += 1) {
    const req = http.request(options);
    req.id = requests_sent;
    req.on('response', (res) => {
      res.on('data', function(data) {
        console.log(`res#${this.req.id} data:${data}`);
      });
      res.on('end', function(data) {
        console.log(`res#${this.req.id} end`);
        requests_done += 1;
        req.destroy();
      });
    });
    req.on('close', function() {
      console.log(`req#${this.id} close`);
    });
    req.on('error', function() {
      console.log(`req#${this.id} error`);
      this.destroy();
    });
    req.setTimeout(50, function() {
      console.log(`req#${this.id} timeout`);
      this.abort();
      requests_done += 1;
    });
    req.end();
  }
  setTimeout(function maybeDone() {
    if (requests_done >= requests_sent) {
      setTimeout(() => {
        server.close();
      }, 100);
    } else {
      setTimeout(maybeDone, 100);
    }
  }, 100);
});
process.on('exit', () => {
  console.error(`done=${requests_done} sent=${requests_sent}`);
  assert.strictEqual(requests_done, requests_sent);
});
