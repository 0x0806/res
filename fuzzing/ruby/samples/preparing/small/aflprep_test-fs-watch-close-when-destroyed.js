'use strict';
if (common.isIBMi)
  common.skip('IBMi does not support `fs.watch()`');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const root = path.join(tmpdir.path, 'watched-directory');
fs.mkdirSync(root);
const watcher = fs.watch(root, { persistent: false, recursive: false });
watcher.addListener('error', () => {
  setTimeout(
    common.platformTimeout(10)
  );
});
watcher.addListener('change', () => {
  setTimeout(
    () => { watcher.close(); },
    common.platformTimeout(10)
  );
});
fs.rmdirSync(root);
setTimeout(
  common.mustCall(() => {}),
  common.platformTimeout(100)
);
