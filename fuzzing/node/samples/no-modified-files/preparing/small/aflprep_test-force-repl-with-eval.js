'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const cp = spawn(process.execPath, ['-i', '-e', 'console.log("42")']);
let gotToEnd = false;
cp.stdout.setEncoding('utf8');
let output = '';
cp.stdout.on('data', function(b) {
  output += b;
  if (output.endsWith('> 42\n')) {
    gotToEnd = true;
    cp.kill();
  }
});
process.on('exit', function() {
  assert(gotToEnd);
});
