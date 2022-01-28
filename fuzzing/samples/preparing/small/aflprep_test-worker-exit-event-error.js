'use strict';
const { Worker } = require('worker_threads');
process.on('uncaughtException', common.mustCall());
new Worker('', { eval: true })
  .on('exit', common.mustCall(() => { throw new Error('foo'); }));
