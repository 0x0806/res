'use strict';
const assert = require('assert');
Promise.reject(new Error('alas'));
process.on('exit', assert.strictEqual.bind(null, 1));
