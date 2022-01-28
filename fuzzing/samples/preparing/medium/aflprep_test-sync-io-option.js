'use strict';
const assert = require('assert');
const { promisify } = require('util');
const execFile = promisify(require('child_process').execFile);
if (process.argv[2] === 'late-sync-io') {
  setImmediate(() => {
    require('fs').statSync(__filename);
  });
  return;
} else if (process.argv[2] === 'early-sync-io') {
  require('fs').statSync(__filename);
  return;
}
(async function() {
  for (const { execArgv, variant, warnings } of [
    { execArgv: ['--trace-sync-io'], variant: 'late-sync-io', warnings: 1 },
    { execArgv: [], variant: 'late-sync-io', warnings: 0 },
    { execArgv: ['--trace-sync-io'], variant: 'early-sync-io', warnings: 0 },
    { execArgv: [], variant: 'early-sync-io', warnings: 0 },
  ]) {
    const { stdout, stderr } =
      await execFile(process.execPath, [...execArgv, __filename, variant]);
    assert.strictEqual(stdout, '');
    const actualWarnings =
    if (warnings === 0)
      assert.strictEqual(actualWarnings, null);
    else
      assert.strictEqual(actualWarnings.length, warnings);
  }
})().then(common.mustCall());
