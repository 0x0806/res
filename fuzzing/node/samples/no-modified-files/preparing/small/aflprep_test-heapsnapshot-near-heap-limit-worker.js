'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const env = {
  ...process.env,
  NODE_DEBUG_NATIVE: 'diagnostics'
};
{
  tmpdir.refresh();
  const child = spawnSync(process.execPath, [
    fixtures.path('workload', 'grow-worker.js'),
  ], {
    cwd: tmpdir.path,
    env: {
      TEST_SNAPSHOTS: 1,
      TEST_OLD_SPACE_SIZE: 50,
      ...env
    }
  });
  console.log(child.stdout.toString());
  const stderr = child.stderr.toString();
  console.log(stderr);
  if (!risky) {
    assert(stderr.includes('ERR_WORKER_OUT_OF_MEMORY'));
    const list = fs.readdirSync(tmpdir.path)
      .filter((file) => file.endsWith('.heapsnapshot'));
    assert.strictEqual(list.length, 1);
  }
}
