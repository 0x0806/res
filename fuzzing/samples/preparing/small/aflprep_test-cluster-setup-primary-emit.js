'use strict';
const assert = require('assert');
const cluster = require('cluster');
assert(cluster.isPrimary);
function emitAndCatch(next) {
  cluster.once('setup', common.mustCall(function(settings) {
    assert.strictEqual(settings.exec, 'new-exec');
    setImmediate(next);
  }));
  cluster.setupPrimary({ exec: 'new-exec' });
}
function emitAndCatch2(next) {
  cluster.once('setup', common.mustCall(function(settings) {
    assert('exec' in settings);
    setImmediate(next);
  }));
  cluster.setupPrimary();
}
emitAndCatch(common.mustCall(function() {
  emitAndCatch2(common.mustCall());
}));
