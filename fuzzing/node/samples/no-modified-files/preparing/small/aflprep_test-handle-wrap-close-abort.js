'use strict';
process.on('uncaughtException', common.mustCall(2));
setTimeout(function() {
  process.nextTick(function() {
    const c = setInterval(function() {
      clearInterval(c);
      throw new Error('setInterval');
    }, 1);
  });
  setTimeout(function() {
    throw new Error('setTimeout');
  }, 1);
}, 1);
