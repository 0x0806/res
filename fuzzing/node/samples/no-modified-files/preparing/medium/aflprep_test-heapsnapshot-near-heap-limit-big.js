'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const env = {
  ...process.env,
  NODE_DEBUG_NATIVE: 'diagnostics'
};
if (!common.enoughTestMem)
  common.skip('Insufficient memory for snapshot test');
{
  console.log('\nTesting limit = 3');
  tmpdir.refresh();
  const child = spawnSync(process.execPath, [
    '--heapsnapshot-near-heap-limit=3',
    '--max-old-space-size=512',
    fixtures.path('workload', 'grow.js'),
  ], {
    cwd: tmpdir.path,
    env: {
      ...env,
      TEST_CHUNK: 2000,
    }
  });
  const stderr = child.stderr.toString();
  console.log(stderr);
  assert(common.nodeProcessAborted(child.status, child.signal),
         'process should have aborted, but did not');
  const list = fs.readdirSync(tmpdir.path)
    .filter((file) => file.endsWith('.heapsnapshot'));
  const risky = [...stderr.matchAll(
  assert(list.length + risky > 0 && list.length <= 3,
         `Generated ${list.length} snapshots ` +
    `and ${risky} was too risky`);
}
