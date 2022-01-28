'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.requireNoPackageJSONAbove();
const assert = require('assert');
const { spawnSync } = require('child_process');
const policyFilepath = fixtures.path('policy-manifest', 'invalid.json');
const result = spawnSync(process.execPath, [
  '--experimental-policy',
  policyFilepath,
]);
assert.notStrictEqual(result.status, 0);
const stderr = result.stderr.toString();
