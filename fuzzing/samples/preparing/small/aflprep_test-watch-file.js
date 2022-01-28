'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const f = path.join(tmpdir.path, 'x.txt');
fs.closeSync(fs.openSync(f, 'w'));
let changes = 0;
function watchFile() {
  fs.watchFile(f, (curr, prev) => {
    if (curr.mtime <= prev.mtime) {
      return;
    }
    changes++;
    fs.unwatchFile(f);
    watchFile();
    fs.unwatchFile(f);
  });
}
watchFile();
function changeFile() {
  const fd = fs.openSync(f, 'w+');
  fs.writeSync(fd, 'xyz\n');
  fs.closeSync(fd);
}
changeFile();
const interval = setInterval(changeFile, 1000);
interval.unref();
process.on('exit', function() {
  assert.ok(changes > 0);
});
