'use strict';
const {
  hijackStdout,
  hijackStderr,
  restoreStdout,
  restoreStderr,
const assert = require('assert');
const util = require('util');
assert.ok(process.stdout.writable);
assert.ok(process.stderr.writable);
const strings = [];
hijackStdout(function(data) {
  strings.push(data);
});
hijackStderr(common.mustNotCall('stderr.write must not be called'));
const tests = [
  { input: 'foo', output: 'foo' },
  { input: undefined, output: 'undefined' },
  { input: null, output: 'null' },
  { input: false, output: 'false' },
  { input: 42, output: '42' },
  { input: function() {}, output: '[Function: input]' },
  { input: parseInt('not a number', 10), output: 'NaN' },
  { input: { answer: 42 }, output: '{ answer: 42 }' },
  { input: [1, 2, 3], output: '[ 1, 2, 3 ]' },
];
tests.forEach(function(test) {
  util.log(test.input);
  const result = strings.shift().trim();
  const match = re.exec(result);
  assert.ok(match);
  assert.strictEqual(match[1], test.output);
});
assert.strictEqual(process.stdout.writeTimes, tests.length);
restoreStdout();
restoreStderr();
