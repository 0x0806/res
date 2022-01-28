'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const cp = spawn(process.execPath, ['-i']);
cp.stdout.setEncoding('utf8');
let out = '';
cp.stdout.on('data', (d) => {
  out += d;
});
cp.stdout.on('end', common.mustCall(() => {
  assert.strictEqual(out, `Welcome to Node.js ${process.version}.\n` +
                        'Type ".help" for more information.\n> ');
}));
cp.stdin.end('');
