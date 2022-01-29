'use strict';
const assert = require('assert');
const net = require('net');
const server = net.createServer(common.mustCall()).listen(0);
let collected = false;
const gcListener = { ongc() { collected = true; } };
{
  const gcObject = {};
  onGC(gcObject, gcListener);
  const sock = net.createConnection(
    server.address().port,
    common.mustCall(() => {
      assert.strictEqual(collected, false);
      setImmediate(done, sock);
    }));
}
function done(sock) {
  global.gc();
  setImmediate(() => {
    assert.strictEqual(collected, true);
    sock.end();
    server.close();
  });
}
