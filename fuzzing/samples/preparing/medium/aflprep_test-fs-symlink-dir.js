'use strict';
if (!common.canCreateSymLink())
  common.skip('insufficient privileges');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const linkTargets = [
  'relative-target',
  path.join(tmpdir.path, 'absolute-target'),
];
const linkPaths = [
  path.relative(process.cwd(), path.join(tmpdir.path, 'relative-path')),
  path.join(tmpdir.path, 'absolute-path'),
];
function testSync(target, path) {
  fs.symlinkSync(target, path);
  fs.readdirSync(path);
}
function testAsync(target, path) {
  fs.symlink(target, path, common.mustSucceed(() => {
    fs.readdirSync(path);
  }));
}
for (const linkTarget of linkTargets) {
  fs.mkdirSync(path.resolve(tmpdir.path, linkTarget));
  for (const linkPath of linkPaths) {
    testSync(linkTarget, `${linkPath}-${path.basename(linkTarget)}-sync`);
    testAsync(linkTarget, `${linkPath}-${path.basename(linkTarget)}-async`);
  }
}
{
  function testSync(target, path) {
    fs.symlinkSync(target, path);
    assert(!fs.existsSync(path));
  }
  function testAsync(target, path) {
    fs.symlink(target, path, common.mustSucceed(() => {
      assert(!fs.existsSync(path));
    }));
  }
  for (const linkTarget of linkTargets.map((p) => p + '-broken')) {
    for (const linkPath of linkPaths) {
      testSync(linkTarget, `${linkPath}-${path.basename(linkTarget)}-sync`);
      testAsync(linkTarget, `${linkPath}-${path.basename(linkTarget)}-async`);
    }
  }
}
