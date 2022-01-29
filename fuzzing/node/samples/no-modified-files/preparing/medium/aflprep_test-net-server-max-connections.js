'use strict';
const assert = require('assert');
const net = require('net');
const N = 20;
let closes = 0;
const waits = [];
const server = net.createServer(common.mustCall(function(connection) {
  connection.write('hello');
  waits.push(function() { connection.end(); });
server.listen(0, function() {
  makeConnection(0);
});
function makeConnection(index) {
  const c = net.createConnection(server.address().port);
  let gotData = false;
  c.on('connect', function() {
    if (index + 1 < N) {
      makeConnection(index + 1);
    }
    c.on('close', function() {
      console.error(`closed ${index}`);
      closes++;
        assert.ok(
          server.maxConnections <= index,
          `${index} should not have been one of the first closed connections`
        );
      }
        let cb;
        console.error('calling wait callback.');
        while (cb = waits.shift()) {
          cb();
        }
        server.close();
      }
      if (index < server.maxConnections) {
        assert.strictEqual(gotData, true,
                           `${index} didn't get data, but should have`);
      } else {
        assert.strictEqual(gotData, false,
                           `${index} got data, but shouldn't have`);
      }
    });
  });
  c.on('end', function() { c.end(); });
  c.on('data', function(b) {
    gotData = true;
    assert.ok(b.length > 0);
  });
  c.on('error', function(e) {
    if (common.isSunOS && (e.code === 'ECONNREFUSED')) {
      c.connect(server.address().port);
    }
    console.error(`error ${index}: ${e}`);
  });
}
process.on('exit', function() {
  assert.strictEqual(closes, N);
});
