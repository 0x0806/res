'use strict';
const assert = require('assert');
const { spawn, fork, execFile } = require('child_process');
const cmd = common.isWindows ? 'rundll32' : 'ls';
const invalidcmd = 'hopefully_you_dont_have_this_on_your_machine';
const empty = fixtures.path('empty.js');
const invalidArgValueError = {
  code: 'ERR_INVALID_ARG_VALUE',
  name: 'TypeError'
};
const invalidArgTypeError = {
  code: 'ERR_INVALID_ARG_TYPE',
  name: 'TypeError'
};
assert.throws(function() {
  spawn(invalidcmd, 'this is not an array');
}, invalidArgTypeError);
spawn(cmd);
spawn(cmd, []);
spawn(cmd, {});
spawn(cmd, [], {});
assert.throws(function() {
  spawn();
}, invalidArgTypeError);
assert.throws(function() {
  spawn('');
}, invalidArgValueError);
assert.throws(function() {
  const file = { toString() { return null; } };
  spawn(file);
}, invalidArgTypeError);
assert.throws(function() {
  spawn(cmd, true);
}, invalidArgTypeError);
assert.throws(function() {
  spawn(cmd, [], null);
}, invalidArgTypeError);
assert.throws(function() {
  spawn(cmd, [], 1);
}, invalidArgTypeError);
assert.throws(function() {
  spawn(cmd, [], { uid: 2 ** 63 });
}, invalidArgTypeError);
assert.throws(function() {
  spawn(cmd, [], { gid: 2 ** 63 });
}, invalidArgTypeError);
const a = [];
const o = {};
function c() {}
const s = 'string';
const u = undefined;
const n = null;
spawn(cmd);
spawn(cmd, a);
spawn(cmd, a, o);
spawn(cmd, o);
spawn(cmd, u, o);
spawn(cmd, n, o);
spawn(cmd, a, u);
assert.throws(function() { spawn(cmd, a, n); }, invalidArgTypeError);
assert.throws(function() { spawn(cmd, s); }, invalidArgTypeError);
assert.throws(function() { spawn(cmd, a, s); }, invalidArgTypeError);
execFile(cmd);
execFile(cmd, a);
execFile(cmd, a, o);
execFile(cmd, a, o, c);
execFile(cmd, a, c);
execFile(cmd, o);
execFile(cmd, o, c);
execFile(cmd, c);
execFile(cmd, u, o, c);
execFile(cmd, a, u, c);
execFile(cmd, a, o, u);
execFile(cmd, n, o, c);
execFile(cmd, a, n, c);
execFile(cmd, a, o, n);
execFile(cmd, u, u, u);
execFile(cmd, u, u, c);
execFile(cmd, u, o, u);
execFile(cmd, a, u, u);
execFile(cmd, n, n, n);
execFile(cmd, n, n, c);
execFile(cmd, n, o, n);
execFile(cmd, a, n, n);
execFile(cmd, a, u);
execFile(cmd, a, n);
execFile(cmd, o, u);
execFile(cmd, o, n);
execFile(cmd, c, u);
execFile(cmd, c, n);
assert.throws(function() { execFile(cmd, s, o, c); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, a, s, c); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, a, o, s); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, a, s); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, o, s); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, u, u, s); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, n, n, s); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, a, u, s); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, a, n, s); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, u, o, s); }, invalidArgValueError);
assert.throws(function() { execFile(cmd, n, o, s); }, invalidArgValueError);
fork(empty);
fork(empty, a);
fork(empty, a, o);
fork(empty, o);
fork(empty, u, u);
fork(empty, u, o);
fork(empty, a, u);
fork(empty, n, n);
fork(empty, n, o);
fork(empty, a, n);
assert.throws(function() { fork(empty, s); }, invalidArgValueError);
assert.throws(function() { fork(empty, a, s); }, invalidArgValueError);
