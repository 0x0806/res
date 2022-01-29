'use strict';
const assert = require('assert');
const cluster = require('cluster');
const net = require('net');
if (cluster.isPrimary) {
  cluster.fork().on('exit', common.mustCall(function(statusCode) {
    assert.strictEqual(statusCode, 0);
  }));
} else {
  net.createServer(common.mustNotCall()).listen(process.exit);
}
