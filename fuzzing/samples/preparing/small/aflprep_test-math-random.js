'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const results = new Set();
for (let i = 0; i < 10; i++) {
  const result = spawnSync(process.execPath, ['-p', 'Math.random()']);
  assert.strictEqual(result.status, 0);
  results.add(result.stdout.toString());
}
assert(results.size > 1);
