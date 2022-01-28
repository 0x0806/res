'use strict';
const assert = require('assert');
if (process.argv[2] === 'child') {
  console.log('hello');
  for (let i = 0; i < 200; i++) {
    console.log('filler');
  }
  console.log('goodbye');
  process.exit(0);
} else {
  const spawn = require('child_process').spawn;
  const child = spawn(process.argv[0], [process.argv[1], 'child']);
  let stdout = '';
  child.stderr.on('data', common.mustNotCall());
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', common.mustCallAtLeast((data) => {
    stdout += data;
  }));
  child.on('close', common.mustCall(() => {
    assert.strictEqual(stdout.slice(0, 6), 'hello\n');
    assert.strictEqual(stdout.slice(stdout.length - 8), 'goodbye\n');
  }));
}
