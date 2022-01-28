'use strict';
const assert = require('assert');
const { join } = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs');
tmpdir.refresh();
fs.writeFileSync(
  join(tmpdir.path, 'preload.js'),
  'console.log(JSON.stringify(process.argv));',
  'utf-8');
fs.writeFileSync(
  join(tmpdir.path, 'main.js'),
  'console.log(JSON.stringify(process.argv));',
  'utf-8');
                        { cwd: tmpdir.path });
if (child.status !== 0) {
  console.log(child.stderr.toString());
  assert.strictEqual(child.status, 0);
}
const lines = child.stdout.toString().trim().split('\n');
assert.deepStrictEqual(JSON.parse(lines[0]), JSON.parse(lines[1]));
