'use strict';
const assert = require('assert');
const child_process = require('child_process');
const p = child_process.spawn(process.execPath, [
  '-e',
  'require(process.argv[1]);',
  wrong_script,
]);
p.stdout.on('data', common.mustNotCall());
let output = '';
p.stderr.on('data', (data) => output += data);
p.stderr.on('end', common.mustCall(() => {
}));
