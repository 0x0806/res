'use strict';
const assert = require('assert');
const fork = require('child_process').fork;
if (process.argv[2] === 'child') {
  process.send('1');
  setTimeout(function() {
    process.send('2');
  }, 200);
  process.on('disconnect', function() {
    process.stdout.write('3');
  });
} else {
  const child = fork(__filename, ['child'], { silent: true });
  const ipc = [];
  let stdout = '';
  child.on('message', function(msg) {
    ipc.push(msg);
    if (msg === '2') child.disconnect();
  });
  child.stdout.on('data', function(chunk) {
    stdout += chunk;
  });
  child.once('exit', function() {
    assert.deepStrictEqual(ipc, ['1', '2']);
    assert.strictEqual(stdout, '3');
  });
}
