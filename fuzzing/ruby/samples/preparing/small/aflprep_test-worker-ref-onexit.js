'use strict';
const { Worker } = require('worker_threads');
const w = new Worker('setInterval(() => {}, 100);', { eval: true });
w.unref();
w.on('exit', common.mustNotCall());
