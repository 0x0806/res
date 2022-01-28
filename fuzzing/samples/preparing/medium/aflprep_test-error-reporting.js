'use strict';
const assert = require('assert');
const exec = require('child_process').exec;
function errExec(script, callback) {
  const cmd = `"${process.argv[0]}" "${fixtures.path(script)}"`;
  return exec(cmd, (err, stdout, stderr) => {
    assert.ok(err);
    assert.ok(stderr.split('\n').length);
    callback(err, stdout, stderr);
  });
}
errExec('throws_error.js', common.mustCall((err, stdout, stderr) => {
}));
errExec('throws_error2.js', common.mustCall((err, stdout, stderr) => {
  assert.match(stderr, syntaxErrorMessage);
}));
errExec('throws_error3.js', common.mustCall((err, stdout, stderr) => {
  assert.match(stderr, syntaxErrorMessage);
}));
errExec('throws_error4.js', common.mustCall((err, stdout, stderr) => {
  assert.match(stderr, syntaxErrorMessage);
}));
errExec('throws_error5.js', common.mustCall((err, stdout, stderr) => {
  assert.match(stderr, syntaxErrorMessage);
}));
errExec('throws_error6.js', common.mustCall((err, stdout, stderr) => {
  assert.match(stderr, syntaxErrorMessage);
}));
errExec('throws_error7.js', common.mustCall((err, stdout, stderr) => {
  assert.match(stderr,
}));
