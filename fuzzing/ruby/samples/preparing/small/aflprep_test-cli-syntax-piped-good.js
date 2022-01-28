'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const node = process.execPath;
const syntaxArgs = [
  '-c',
  '--check',
];
syntaxArgs.forEach(function(arg) {
  const stdin = 'throw new Error("should not get run");';
  const c = spawnSync(node, [arg], { encoding: 'utf8', input: stdin });
  assert.strictEqual(c.stdout, '');
  assert.strictEqual(c.stderr, '');
  assert.strictEqual(c.status, 0);
});
syntaxArgs.forEach(function(arg) {
  const stdin = 'export var p = 5; throw new Error("should not get run");';
  const c = spawnSync(
    node,
    ['--no-warnings', '--input-type=module', arg],
    { encoding: 'utf8', input: stdin }
  );
  assert.strictEqual(c.stdout, '');
  assert.strictEqual(c.stderr, '');
  assert.strictEqual(c.status, 0);
});
