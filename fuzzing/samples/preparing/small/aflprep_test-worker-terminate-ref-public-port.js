'use strict';
const { Worker } = require('worker_threads');
const w = new Worker(`
const p = require('worker_threads').parentPort;
while(true) p.postMessage({})`, { eval: true });
w.once('message', () => w.terminate());
w.once('exit', common.mustCall());
