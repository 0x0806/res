'use strict';
const { AsyncLocalStorage } = require('async_hooks');
const als = new AsyncLocalStorage();
const done = common.mustCall();
function run(count) {
  if (count !== 0) return als.run({}, run, --count);
  done();
}
run(1000);
