'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
if (process.argv[2] === 'parent')
  parent();
else
  grandparent();
function grandparent() {
  const child = spawn(process.execPath, [__filename, 'parent']);
  child.stderr.pipe(process.stderr);
  let output = '';
  const input = 'asdfasdf';
  child.stdout.on('data', function(chunk) {
    output += chunk;
  });
  child.stdout.setEncoding('utf8');
  child.stdin.end(input);
  child.on('close', function(code, signal) {
    assert.strictEqual(code, 0);
    assert.strictEqual(signal, null);
    assert.strictEqual(output.trim(), input.trim());
  });
}
function parent() {
  spawn('cat', [], { stdio: 'inherit' });
}
