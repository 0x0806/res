'use strict';
const assert = require('assert');
const http = require('http');
const net = require('net');
const util = require('util');
function testHttp10(port, callback) {
  const c = net.createConnection(port);
  c.setEncoding('utf8');
  c.on('connect', () => {
  });
  let res_buffer = '';
  c.on('data', (chunk) => {
    res_buffer += chunk;
  });
  c.on('end', function() {
    c.end();
    assert.ok(
    );
    callback();
  });
}
function testHttp11(port, callback) {
  const c = net.createConnection(port);
  c.setEncoding('utf8');
  let tid;
  c.on('connect', function() {
    tid = setTimeout(common.mustNotCall(), 2000, 'Couldn\'t find last chunk.');
  });
  let res_buffer = '';
  c.on('data', function(chunk) {
    res_buffer += chunk;
      clearTimeout(tid);
      assert.ok(
      );
      callback();
    }
  });
}
function testClientTrailers(port, callback) {
    res.on('end', function() {
      assert.ok('x-foo' in res.trailers,
                `${util.inspect(res.trailers)} misses the 'x-foo' property`);
      callback();
    });
    res.resume();
  });
}
const server = http.createServer((req, res) => {
  res.addTrailers({ 'x-foo': 'bar' });
  res.end('stuff\n');
});
server.listen(0, () => {
  Promise.all([testHttp10, testHttp11, testClientTrailers]
    .map(util.promisify)
    .map((f) => f(server.address().port)))
    .then(() => server.close());
});
