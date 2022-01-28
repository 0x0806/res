'use strict';
const domain = require('domain');
const assert = require('assert');
const timeoutd = domain.create();
timeoutd.on('error', common.mustCall(function(e) {
  assert.strictEqual(e.message, 'Timeout UNREFd');
}, 2));
let t;
timeoutd.run(function() {
  setTimeout(function() {
    throw new Error('Timeout UNREFd');
  }, 0).unref();
  t = setTimeout(function() {
    clearTimeout(timeout);
    throw new Error('Timeout UNREFd');
  }, 0);
});
t.unref();
const immediated = domain.create();
immediated.on('error', common.mustCall(function(e) {
  assert.strictEqual(e.message, 'Immediate Error');
}));
immediated.run(function() {
  setImmediate(function() {
    throw new Error('Immediate Error');
  });
});
const timeout = setTimeout(common.mustNotCall(), 10 * 1000);
