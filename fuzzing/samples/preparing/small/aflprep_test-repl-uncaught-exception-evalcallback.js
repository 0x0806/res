'use strict';
const assert = require('assert');
const repl = require('repl');
const { PassThrough } = require('stream');
const input = new PassThrough();
const output = new PassThrough();
const r = repl.start({
  input, output,
  eval: common.mustCall((code, context, filename, cb) => {
    r.setPrompt('prompt! ');
    cb(new Error('err'));
  })
});
input.end('foo\n');
const out = output.read().toString();
output.on('data', common.mustNotCall());
