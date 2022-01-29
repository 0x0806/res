'use strict';
const { Worker } = require('worker_threads');
new Worker("require('trace_events')", { eval: true })
  .on('error', common.expectsError({
    code: 'ERR_TRACE_EVENTS_UNAVAILABLE',
    name: 'Error'
  }));
