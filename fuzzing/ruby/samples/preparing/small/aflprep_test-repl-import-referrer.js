'use strict';
const assert = require('assert');
const cp = require('child_process');
const args = ['--interactive'];
const opts = { cwd: fixtures.path('es-modules') };
const child = cp.spawn(process.execPath, args, opts);
let output = '';
child.stdout.setEncoding('utf8');
child.stdout.on('data', (data) => {
  output += data;
});
child.on('exit', common.mustCall(() => {
  assert.deepStrictEqual(
    results,
    ['[Module: null prototype] { message: \'A message\' }', '']
  );
}));
child.stdin.write('.exit');
child.stdin.end();
