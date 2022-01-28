'use strict';
const async_hooks = require('async_hooks');
const hook = async_hooks.createHook({
}).enable();
new async_hooks.AsyncResource('foobar', { requireManualDestroy: true });
setImmediate(() => {
  global.gc();
  setImmediate(() => {
    hook.disable();
  });
});
