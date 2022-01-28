'use strict';
const { AsyncResource } = require('async_hooks');
try {
  new AsyncResource('foo').runInAsyncScope(() => { throw new Error('bar'); });
} catch {}
