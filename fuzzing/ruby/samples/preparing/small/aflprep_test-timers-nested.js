'use strict';
const assert = require('assert');
const scenarios = [0, 100];
scenarios.forEach(function(delay) {
  let nestedCalled = false;
  setTimeout(function A() {
    setTimeout(function B() {
      nestedCalled = true;
    }, delay);
    sleep(delay);
    process.nextTick(function() {
      assert.ok(!nestedCalled);
    });
    process.on('exit', function onExit() {
      assert.ok(nestedCalled);
    });
  }, delay);
});
