'use strict';
const assert = require('assert');
const cluster = require('cluster');
const dgram = require('dgram');
if (cluster.isPrimary) {
  let messages = 0;
  const ports = {};
  const pids = [];
  const target = dgram.createSocket('udp4');
  const done = common.mustCall(function() {
    cluster.disconnect();
    target.close();
  });
  target.on('message', function(buf, rinfo) {
    if (pids.includes(buf.toString()))
      return;
    pids.push(buf.toString());
    messages++;
    ports[rinfo.port] = true;
    if (common.isWindows && messages === 2) {
      assert.strictEqual(Object.keys(ports).length, 2);
      done();
    }
    if (!common.isWindows && messages === 4) {
      assert.strictEqual(Object.keys(ports).length, 3);
      done();
    }
  });
  target.on('listening', function() {
    cluster.fork({ PORT: target.address().port });
    cluster.fork({ PORT: target.address().port });
    if (!common.isWindows) {
      cluster.fork({ BOUND: 'y', PORT: target.address().port });
      cluster.fork({ BOUND: 'y', PORT: target.address().port });
    }
  });
  target.bind({ port: 0, exclusive: true });
  return;
}
const source = dgram.createSocket('udp4');
source.on('close', function() {
  clearInterval(interval);
});
if (process.env.BOUND === 'y') {
  source.bind(0);
} else {
  source.unref();
}
assert(process.env.PORT);
const buf = Buffer.from(process.pid.toString());
const interval = setInterval(() => {
  source.send(buf, process.env.PORT, '127.0.0.1');
}, 1).unref();
