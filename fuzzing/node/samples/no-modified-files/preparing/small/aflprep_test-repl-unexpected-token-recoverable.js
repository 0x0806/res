'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const args = [ '-i' ];
const child = spawn(process.execPath, args);
const input = 'const foo = "bar\\\nbaz"';
child.stderr.setEncoding('utf8');
child.stderr.on('data', (d) => {
  throw new Error('child.stderr be silent');
});
child.stdout.setEncoding('utf8');
let out = '';
child.stdout.on('data', (d) => {
  out += d;
});
child.stdout.on('end', () => {
  assert.match(out, expectOut);
  console.log('ok');
});
child.stdin.end(input);
