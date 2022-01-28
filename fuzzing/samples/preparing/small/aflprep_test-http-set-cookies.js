'use strict';
const assert = require('assert');
const http = require('http');
const countdown = new Countdown(2, () => server.close());
const server = http.createServer(function(req, res) {
    res.writeHead(200, [['set-cookie', 'A'],
    res.end('one\n');
  } else {
    res.writeHead(200, [['set-cookie', 'A'],
                        ['set-cookie', 'B'],
    res.end('two\n');
  }
});
server.listen(0);
server.on('listening', function() {
    assert.deepStrictEqual(res.headers['set-cookie'], ['A']);
    res.on('data', function(chunk) {
      console.log(chunk.toString());
    });
    res.on('end', function() {
      countdown.dec();
    });
  });
    assert.deepStrictEqual(res.headers['set-cookie'], ['A', 'B']);
    res.on('data', function(chunk) {
      console.log(chunk.toString());
    });
    res.on('end', function() {
      countdown.dec();
    });
  });
});
