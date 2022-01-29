'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
if (!common.isMainThread)
  common.skip('process.chdir is not available in Workers');
process.chdir('..');
assert.notStrictEqual(process.cwd(), __dirname);
process.chdir(__dirname);
assert.strictEqual(process.cwd(), __dirname);
let dirName;
if (process.versions.icu) {
  dirName = 'weird \uc3a4\uc3ab\uc3af characters \u00e1\u00e2\u00e3';
} else {
  dirName = 'weird \ud83d\udc04 characters \ud83d\udc05';
}
const dir = path.resolve(tmpdir.path, dirName);
tmpdir.refresh();
fs.mkdirSync(dir);
process.chdir(dir);
assert.strictEqual(process.cwd().normalize(), dir.normalize());
process.chdir('..');
assert.strictEqual(process.cwd().normalize(),
                   path.resolve(tmpdir.path).normalize());
const err = {
  code: 'ERR_INVALID_ARG_TYPE',
};
assert.throws(function() { process.chdir({}); }, err);
assert.throws(function() { process.chdir(); }, err);
