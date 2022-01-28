'use strict';
const assert = require('assert');
function enqueueMicrotask(fn) {
  Promise.resolve().then(fn);
}
let done = 0;
process.on('exit', function() {
  assert.strictEqual(done, 2);
});
setTimeout(function() {
  enqueueMicrotask(function() {
    done++;
  });
}, 0);
setTimeout(function() {
  let called = false;
  enqueueMicrotask(function() {
    process.nextTick(function() {
      called = true;
    });
  });
  setTimeout(function() {
    if (called)
      done++;
  }, 0);
}, 0);
