'use strict';
const assert = require('assert');
const { spawnSync } = require('child_process');
const child = spawnSync(process.execPath, [fixture]);
const errMsg = 'TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension';
assert.strictEqual(child.status, 1);
assert.strictEqual(child.signal, null);
assert.strictEqual(child.stdout.toString().trim(), '');
assert.ok(child.stderr.toString().includes(errMsg));
