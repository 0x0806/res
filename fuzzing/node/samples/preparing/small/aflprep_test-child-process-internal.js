'use strict';
const assert = require('assert');
const PREFIX = 'NODE_';
const normal = { cmd: `foo${PREFIX}` };
const internal = { cmd: `${PREFIX}bar` };
if (process.argv[2] === 'child') {
  process.send(normal);
  process.send(internal);
  process.exit(0);
} else {
  const fork = require('child_process').fork;
  const child = fork(process.argv[1], ['child']);
  child.once('message', common.mustCall(function(data) {
    assert.deepStrictEqual(data, normal);
  }));
  child.once('internalMessage', common.mustCall(function(data) {
    assert.deepStrictEqual(data, internal);
  }));
}
