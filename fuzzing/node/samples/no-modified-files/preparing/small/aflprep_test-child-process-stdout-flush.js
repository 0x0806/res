'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const sub = fixtures.path('print-chars.js');
const n = 500000;
const child = spawn(process.argv[0], [sub, n]);
let count = 0;
child.stderr.setEncoding('utf8');
child.stderr.on('data', common.mustNotCall());
child.stdout.setEncoding('utf8');
child.stdout.on('data', (data) => {
  count += data.length;
});
child.on('close', common.mustCall((code, signal) => {
  assert.strictEqual(code, 0);
  assert.strictEqual(signal, null);
  assert.strictEqual(n, count);
}));
