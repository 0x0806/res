'use strict';
const assert = require('assert');
const execFile = require('child_process').execFile;
const warnmod = require.resolve(fixtures.path('warnings.js'));
const node = process.execPath;
const normal = [warnmod];
const noWarn = ['--no-warnings', warnmod];
const traceWarn = ['--trace-warnings', warnmod];
execFile(node, normal, function(er, stdout, stderr) {
  assert.strictEqual(er, null);
  assert.strictEqual(stdout, '');
  assert.match(stderr, warningMessage);
});
execFile(node, noWarn, function(er, stdout, stderr) {
  assert.strictEqual(er, null);
  assert.strictEqual(stdout, '');
  assert.doesNotMatch(stderr, warningMessage);
});
execFile(node, traceWarn, function(er, stdout, stderr) {
  assert.strictEqual(er, null);
  assert.strictEqual(stdout, '');
  assert.match(stderr, warningMessage);
});
