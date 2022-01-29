'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
const w = new Worker('throw new Error()', { eval: true });
w.on('error', common.mustCall());
w.on('exit', common.mustCall((code) => assert.strictEqual(code, 1)));
