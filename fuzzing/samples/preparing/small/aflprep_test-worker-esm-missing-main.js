'use strict';
const assert = require('assert');
const path = require('path');
const { Worker } = require('worker_threads');
tmpdir.refresh();
const missing = path.join(tmpdir.path, 'does-not-exist.js');
const worker = new Worker(missing);
worker.on('error', common.mustCall((err) => {
}));
