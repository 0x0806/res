'use strict';
if (process.features.inspector) {
  common.skip('V8 inspector is enabled');
}
const assert = require('assert');
const { spawnSync } = require('child_process');
const { status, stderr } = spawnSync(
  process.execPath,
  [childPath],
  { env }
);
const warningMessage = 'The inspector is disabled, ' +
                        'coverage could not be collected';
assert.strictEqual(status, 0);
assert.strictEqual(
  stderr.toString().includes(`Warning: ${warningMessage}`),
  true
);
