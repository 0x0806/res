const assert = require('assert');
assert.ok(module.parent);
const expectedPaths = require('module')._nodeModulePaths(process.cwd());
assert.deepStrictEqual(module.parent.paths, expectedPaths);
const cluster = require('cluster');
