'use strict';
const { Worker } = require('worker_threads');
const w = new Worker(
  `const { Worker } = require('worker_threads');
  new Worker("throw new Error('uncaught')", { eval:true })`,
  { eval: true });
w.on('error', common.expectsError({
  name: 'Error',
  message: 'uncaught'
}));
