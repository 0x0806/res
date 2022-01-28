'use strict';
const { AsyncLocalStorage } = require('async_hooks');
let asyncLocalStorage = new AsyncLocalStorage();
asyncLocalStorage.run({}, () => {
  asyncLocalStorage.disable();
  onGC(asyncLocalStorage, { ongc: common.mustCall() });
});
asyncLocalStorage = null;
global.gc();
