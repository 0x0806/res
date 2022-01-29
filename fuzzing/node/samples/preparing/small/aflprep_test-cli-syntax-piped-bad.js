'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const node = process.execPath;
const syntaxArgs = [
  '-c',
  '--check',
];
syntaxArgs.forEach(function(arg) {
  const stdin = 'var foo bar;';
  const c = spawnSync(node, [arg], { encoding: 'utf8', input: stdin });
  assert(c.stderr.startsWith('[stdin]'), `${c.stderr} starts with ${stdin}`);
  assert.strictEqual(c.stdout, '');
  assert.match(c.stderr, syntaxErrorRE);
  assert.strictEqual(c.status, 1);
});
syntaxArgs.forEach(function(arg) {
  const stdin = 'export var p = 5; var foo bar;';
  const c = spawnSync(
    node,
    ['--input-type=module', '--no-warnings', arg],
    { encoding: 'utf8', input: stdin }
  );
  assert(c.stderr.startsWith('[stdin]'), `${c.stderr} starts with ${stdin}`);
  assert.strictEqual(c.stdout, '');
  assert.match(c.stderr, syntaxErrorRE);
  assert.strictEqual(c.status, 1);
});
