'use strict';
const assert = require('assert');
const { AsyncLocalStorage } = require('async_hooks');
const als = new AsyncLocalStorage();
assert.ok(typeof als._propagate === 'function');
als._propagate = common.mustNotCall('_propagate() should not be called');
const done = common.mustCall();
function run(count) {
  if (count === 0) return done();
  als.run({}, () => {
    als.exit(run, --count);
  });
}
run(100);
