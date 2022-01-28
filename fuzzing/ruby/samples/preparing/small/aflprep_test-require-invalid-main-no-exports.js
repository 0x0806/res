'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const testFile = fixtures.path('package-main-enoent', 'test.js');
const { error, status, stderr } = spawnSync(process.execPath, [testFile]);
assert.ifError(error);
assert.strictEqual(status, 0, stderr);
