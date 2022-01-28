'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
const w = new Worker('while(true);', { eval: true });
w.on('online', common.mustCall(() => w.terminate()));
w.on('exit', common.mustCall((code) => assert.strictEqual(code, 1)));
