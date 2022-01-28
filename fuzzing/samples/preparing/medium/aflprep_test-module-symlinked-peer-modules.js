'use strict';
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const tmpDir = tmpdir.path;
const moduleA = path.join(tmpDir, 'moduleA');
const app = path.join(tmpDir, 'app');
const moduleB = path.join(app, 'node_modules', 'moduleB');
const moduleA_link = path.join(app, 'node_modules', 'moduleA');
fs.mkdirSync(moduleA);
fs.mkdirSync(app);
fs.mkdirSync(path.join(app, 'node_modules'));
fs.mkdirSync(moduleB);
try {
  fs.symlinkSync(moduleA, moduleA_link, 'dir');
} catch (err) {
  if (err.code !== 'EPERM') throw err;
  common.skip('insufficient privileges for symlinks');
}
fs.writeFileSync(path.join(moduleA, 'package.json'),
                 JSON.stringify({ name: 'moduleA', main: 'index.js' }), 'utf8');
fs.writeFileSync(path.join(moduleA, 'index.js'),
                 'module.exports = require(\'moduleB\');', 'utf8');
fs.writeFileSync(path.join(app, 'index.js'),
                 '\'use strict\'; require(\'moduleA\');', 'utf8');
fs.writeFileSync(path.join(moduleB, 'package.json'),
                 JSON.stringify({ name: 'moduleB', main: 'index.js' }), 'utf8');
fs.writeFileSync(path.join(moduleB, 'index.js'),
                 'module.exports = 1;', 'utf8');
