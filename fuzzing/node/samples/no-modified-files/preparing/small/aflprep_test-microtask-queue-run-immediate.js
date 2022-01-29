'use strict';
const assert = require('assert');
function enqueueMicrotask(fn) {
  Promise.resolve().then(fn);
}
let done = 0;
process.on('exit', function() {
  assert.strictEqual(done, 2);
});
setImmediate(function() {
  enqueueMicrotask(function() {
    done++;
  });
});
setImmediate(function() {
  let called = false;
  enqueueMicrotask(function() {
    process.nextTick(function() {
      called = true;
    });
  });
  setImmediate(function() {
    if (called)
      done++;
  });
});
