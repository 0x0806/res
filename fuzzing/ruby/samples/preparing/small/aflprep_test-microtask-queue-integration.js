'use strict';
const assert = require('assert');
const implementations = [
  function(fn) {
    Promise.resolve().then(fn);
  },
];
let expected = 0;
let done = 0;
process.on('exit', function() {
  assert.strictEqual(done, expected);
});
function test(scheduleMicrotask) {
  let nextTickCalled = false;
  expected++;
  scheduleMicrotask(function() {
    process.nextTick(function() {
      nextTickCalled = true;
    });
    setTimeout(function() {
      assert(nextTickCalled);
      done++;
    }, 0);
  });
}
implementations.forEach(test);
setTimeout(function() {
  implementations.forEach(function(impl) {
    process.nextTick(test.bind(null, impl));
  });
}, 0);
