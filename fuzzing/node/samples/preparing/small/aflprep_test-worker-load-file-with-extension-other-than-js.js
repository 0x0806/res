'use strict';
const { Worker } = require('worker_threads');
(common.mustCall(() => {
  new Worker(fixtures.path('worker-script.ts'));
}))();
