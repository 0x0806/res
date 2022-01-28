'use strict';
if (common.isIBMi) {
  common.skip('IBMi does not support fs.watch()');
}
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const testDir = tmpdir.path;
const testsubdir = path.join(testDir, 'testsubdir');
const filepath = path.join(testsubdir, 'watch.txt');
fs.mkdirSync(testsubdir, 0o700);
setTimeout(function() {
  const watcher = fs.watch(testDir, { persistent: true }, common.mustNotCall());
  setTimeout(function() {
    fs.writeFileSync(filepath, 'test');
  }, 100);
  setTimeout(function() {
    watcher.close();
  }, 500);
}, 50);
