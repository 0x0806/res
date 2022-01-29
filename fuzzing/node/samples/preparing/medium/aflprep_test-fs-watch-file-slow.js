'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const FILENAME = path.join(tmpdir.path, 'watch-me');
const TIMEOUT = 1300;
let nevents = 0;
try {
  fs.unlinkSync(FILENAME);
} catch {
}
fs.watchFile(FILENAME, { interval: TIMEOUT - 250 }, function(curr, prev) {
  console.log([curr, prev]);
  switch (++nevents) {
    case 1:
      assert.strictEqual(fs.existsSync(FILENAME), false);
      break;
    case 2:
    case 3:
      assert.strictEqual(fs.existsSync(FILENAME), true);
      break;
    case 4:
      assert.strictEqual(fs.existsSync(FILENAME), false);
      fs.unwatchFile(FILENAME);
      break;
    default:
      assert(0);
  }
});
process.on('exit', function() {
  assert.strictEqual(nevents, 4);
});
setTimeout(createFile, TIMEOUT);
function createFile() {
  console.log('creating file');
  fs.writeFileSync(FILENAME, 'test');
  setTimeout(touchFile, TIMEOUT);
}
function touchFile() {
  console.log('touch file');
  fs.writeFileSync(FILENAME, 'test');
  setTimeout(removeFile, TIMEOUT);
}
function removeFile() {
  console.log('remove file');
  fs.unlinkSync(FILENAME);
}
