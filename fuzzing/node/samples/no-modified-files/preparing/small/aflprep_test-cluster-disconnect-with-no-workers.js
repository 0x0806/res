'use strict';
const assert = require('assert');
const cluster = require('cluster');
let disconnected;
process.on('exit', function() {
  assert(disconnected);
});
cluster.disconnect(function() {
  disconnected = true;
});
assert(!disconnected);
