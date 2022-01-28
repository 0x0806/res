'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const linkPath1 = path.join(tmpdir.path, 'junction1');
const linkPath2 = path.join(tmpdir.path, 'junction2');
const linkTarget = fixtures.fixturesDir;
const linkData = fixtures.fixturesDir;
tmpdir.refresh();
fs.symlink(linkData, linkPath1, 'junction', common.mustSucceed(() => {
  verifyLink(linkPath1);
}));
fs.symlinkSync(linkData, linkPath2, 'junction');
verifyLink(linkPath2);
function verifyLink(linkPath) {
  const stats = fs.lstatSync(linkPath);
  assert.ok(stats.isSymbolicLink());
  assert.strictEqual(data1, data2);
  fs.unlinkSync(linkPath);
}
