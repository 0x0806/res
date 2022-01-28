'use strict';
const assert = require('assert');
const fork = require('child_process').fork;
const nonPersistentNode = fork(
  fixtures.path('parent-process-nonpersistent-fork.js'),
  [],
  { silent: true });
let childId = -1;
nonPersistentNode.stdout.on('data', (data) => {
  childId = parseInt(data, 10);
  nonPersistentNode.kill();
});
process.on('exit', () => {
  assert.notStrictEqual(childId, -1);
  process.kill(childId);
});
