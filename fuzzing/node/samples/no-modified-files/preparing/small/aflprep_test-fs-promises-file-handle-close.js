'use strict';
const assert = require('assert');
const { promises: fs } = require('fs');
const warning =
  'Closing a FileHandle object on garbage collection is deprecated. ' +
  'Please close FileHandle objects explicitly using ' +
  'FileHandle.prototype.close(). In the future, an error will be ' +
  'thrown if a file descriptor is closed during garbage collection.';
async function doOpen() {
  const fh = await fs.open(__filename);
  common.expectWarning({
    Warning: [[`Closing file descriptor ${fh.fd} on garbage collection`]],
    DeprecationWarning: [[warning, 'DEP0137']]
  });
  return fh;
}
doOpen().then(common.mustCall((fd) => {
  assert.strictEqual(typeof fd, 'object');
})).then(common.mustCall(() => {
  setImmediate(() => {
    global.gc();
    setImmediate(common.mustCall());
  });
}));
