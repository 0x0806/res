'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const tmpDir = tmpdir.path;
const node_modules = path.join(tmpDir, 'node_modules');
const moduleA = path.join(node_modules, 'moduleA');
const moduleB = path.join(node_modules, 'moduleB');
const moduleA_link = path.join(moduleB, 'node_modules', 'moduleA');
const moduleB_link = path.join(moduleA, 'node_modules', 'moduleB');
fs.mkdirSync(node_modules);
fs.mkdirSync(moduleA);
fs.mkdirSync(moduleB);
fs.mkdirSync(path.join(moduleA, 'node_modules'));
fs.mkdirSync(path.join(moduleB, 'node_modules'));
try {
  fs.symlinkSync(moduleA, moduleA_link);
  fs.symlinkSync(moduleB, moduleB_link);
} catch (err) {
  if (err.code !== 'EPERM') throw err;
  common.skip('insufficient privileges for symlinks');
}
fs.writeFileSync(path.join(tmpDir, 'index.js'),
                 'module.exports = require(\'moduleA\');', 'utf8');
fs.writeFileSync(path.join(moduleA, 'index.js'),
                 'module.exports = {b: require(\'moduleB\')};', 'utf8');
fs.writeFileSync(path.join(moduleB, 'index.js'),
                 'module.exports = {a: require(\'moduleA\')};', 'utf8');
const obj = require(path.join(tmpDir, 'index'));
assert.ok(obj);
assert.ok(obj.b);
assert.ok(obj.b.a);
assert.ok(!obj.b.a.b);
