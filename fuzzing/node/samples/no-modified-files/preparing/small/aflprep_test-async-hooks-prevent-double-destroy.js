'use strict';
const async_hooks = require('async_hooks');
const hook = async_hooks.createHook({
}).enable();
{
  const res = new async_hooks.AsyncResource('foobar');
  res.emitDestroy();
}
setImmediate(() => {
  global.gc();
  setImmediate(() => {
    hook.disable();
  });
});
