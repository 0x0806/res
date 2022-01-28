'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
let watchSeenOne = 0;
let watchSeenTwo = 0;
let watchSeenThree = 0;
let watchSeenFour = 0;
const testDir = tmpdir.path;
const filenameOne = 'watch.txt';
const filepathOne = path.join(testDir, filenameOne);
const filenameTwo = 'hasOwnProperty';
const filepathTwo = filenameTwo;
const filepathTwoAbs = path.join(testDir, filenameTwo);
const filenameFour = 'get';
process.on('exit', function() {
  assert.strictEqual(watchSeenOne, 1);
  assert.strictEqual(watchSeenTwo, 2);
  assert.strictEqual(watchSeenThree, 1);
  assert.strictEqual(watchSeenFour, 1);
});
tmpdir.refresh();
fs.writeFileSync(filepathOne, 'hello');
assert.throws(
  () => { fs.watchFile(filepathOne); },
  { code: 'ERR_INVALID_ARG_TYPE' }
);
fs.watchFile(filepathOne, function() {
  fs.unwatchFile(filepathOne);
  ++watchSeenOne;
});
setTimeout(function() {
  fs.writeFileSync(filepathOne, 'world');
}, 1000);
process.chdir(testDir);
fs.writeFileSync(filepathTwoAbs, 'howdy');
assert.throws(
  () => { fs.watchFile(filepathTwo); },
  { code: 'ERR_INVALID_ARG_TYPE' }
);
  function a() {
    fs.unwatchFile(filepathTwo, a);
    ++watchSeenTwo;
  }
  function b() {
    fs.unwatchFile(filepathTwo, b);
    ++watchSeenTwo;
  }
  fs.watchFile(filepathTwo, a);
  fs.watchFile(filepathTwo, b);
}
setTimeout(function() {
  fs.writeFileSync(filepathTwoAbs, 'pardner');
}, 1000);
  function b() {
    fs.unwatchFile(filenameThree, b);
    ++watchSeenThree;
  }
  const uncalledListener = common.mustNotCall();
  fs.watchFile(filenameThree, uncalledListener);
  fs.watchFile(filenameThree, b);
  fs.unwatchFile(filenameThree, uncalledListener);
}
setTimeout(function() {
  fs.writeFileSync(filenameThree, 'pardner');
}, 1000);
setTimeout(function() {
  fs.writeFileSync(filenameFour, 'hey');
}, 200);
setTimeout(function() {
  fs.writeFileSync(filenameFour, 'hey');
}, 500);
  function a() {
    ++watchSeenFour;
    assert.strictEqual(watchSeenFour, 1);
    fs.unwatchFile(`.${path.sep}${filenameFour}`, a);
  }
  fs.watchFile(filenameFour, a);
}
