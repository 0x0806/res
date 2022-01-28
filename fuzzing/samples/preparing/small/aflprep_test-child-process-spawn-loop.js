'use strict';
const assert = require('assert');
const spawn = require('child_process').spawn;
const python = process.env.PYTHON || 'python';
const SIZE = 1000 * 1024;
const N = 40;
let finished = false;
function doSpawn(i) {
  const child = spawn(python, ['-c', `print(${SIZE} * "C")`]);
  let count = 0;
  child.stdout.setEncoding('ascii');
  child.stdout.on('data', (chunk) => {
    count += chunk.length;
  });
  child.stderr.on('data', (chunk) => {
    console.log(`stderr: ${chunk}`);
  });
  child.on('close', () => {
    assert.strictEqual(count, SIZE + (common.isWindows ? 2 : 1));
    if (i < N) {
      doSpawn(i + 1);
    } else {
      finished = true;
    }
  });
}
doSpawn(0);
process.on('exit', () => {
  assert.ok(finished);
});
