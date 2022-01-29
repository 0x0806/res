'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const testFile = fixtures.path('repl-tab-completion-nested-repls.js');
const result = spawnSync(process.execPath, [testFile]);
assert.ok(result.status, 'testFile swallowed its error');
const err = result.stderr.toString();
assert.ok(err.includes('fhqwhgads'), err);
