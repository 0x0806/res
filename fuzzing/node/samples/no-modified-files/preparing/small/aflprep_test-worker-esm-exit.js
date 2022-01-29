'use strict';
const assert = require('assert');
const { Worker } = require('worker_threads');
w.on('error', common.mustNotCall());
w.on('exit',
     common.mustCall((code) => assert.strictEqual(code, 42))
);
