'use strict';
const assert = require('assert');
const net = require('net');
const ROUNDS = 5;
const ATTEMPTS_PER_ROUND = 50;
let rounds = 1;
let reqs = 0;
let port;
const server = net.createServer().listen(0, common.mustCall(() => {
  port = server.address().port;
  server.close(common.mustCall(pummel));
}));
function pummel() {
  let pending;
  for (pending = 0; pending < ATTEMPTS_PER_ROUND; pending++) {
    net.createConnection(port).on('error', function(err) {
      console.log('pending', pending, 'rounds', rounds);
      assert.strictEqual(err.code, 'ECONNREFUSED');
      if (--pending > 0) return;
      if (rounds === ROUNDS) return check();
      rounds++;
      pummel();
    });
    reqs++;
  }
}
function check() {
  setTimeout(common.mustCall(function() {
    assert.strictEqual(process._getActiveRequests().length, 0);
    const activeHandles = process._getActiveHandles();
    assert.ok(activeHandles.every((val) => val.constructor.name !== 'Socket'));
  }), 0);
}
process.on('exit', function() {
  assert.strictEqual(rounds, ROUNDS);
  assert.strictEqual(reqs, ROUNDS * ATTEMPTS_PER_ROUND);
});
