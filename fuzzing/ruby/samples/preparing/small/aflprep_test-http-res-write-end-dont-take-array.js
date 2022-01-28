'use strict';
const assert = require('assert');
const http = require('http');
const server = http.createServer();
server.once('request', common.mustCall((req, res) => {
  server.on('request', common.mustCall((req, res) => {
    res.end(Buffer.from('asdf'));
  }));
  res.write('string');
  res.write(Buffer.from('asdf'));
  const expectedError = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  };
  assert.throws(
    () => {
      res.write(['array']);
    },
    expectedError
  );
  assert.throws(
    () => {
      res.end(['moo']);
    },
    expectedError
  );
  res.end('string');
}));
server.listen(0, function() {
  http.get({ port: this.address().port }, (res) => {
    res.resume();
    http.get({ port: server.address().port }, (res) => {
      res.resume();
      server.close();
    });
  });
});
