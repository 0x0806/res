'use strict';
const { Worker } = require('worker_threads');
const w = new Worker(`
const dns = require('dns');
dns.lookup('nonexistent.org', () => {});
require('worker_threads').parentPort.postMessage('0');
`, { eval: true });
w.on('message', common.mustCall(() => {
  w.terminate().then(common.mustCall());
}));
