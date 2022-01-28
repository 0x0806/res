'use strict';
const {
  pipeline,
  PassThrough
} = require('stream');
const assert = require('assert');
process.on('uncaughtException', common.mustCall((err) => {
  assert.strictEqual(err.message, 'error');
}));
const s = new PassThrough();
s.end('data');
pipeline(s, async function(source) {
}, common.mustSucceed(() => {
  throw new Error('error');
}));
