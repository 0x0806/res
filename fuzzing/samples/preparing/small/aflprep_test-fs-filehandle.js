'use strict';
const assert = require('assert');
const path = require('path');
const fs = internalBinding('fs');
let fdnum;
{
  const ctx = {};
  fdnum = fs.openFileHandle(path.toNamespacedPath(__filename),
                            stringToFlags('r'), 0o666, undefined, ctx).fd;
  assert.strictEqual(ctx.errno, undefined);
}
const deprecationWarning =
  'Closing a FileHandle object on garbage collection is deprecated. ' +
  'Please close FileHandle objects explicitly using ' +
  'FileHandle.prototype.close(). In the future, an error will be ' +
  'thrown if a file descriptor is closed during garbage collection.';
common.expectWarning({
    'These APIs are for internal testing only. Do not use them.',
  ],
  'Warning': [
    `Closing file descriptor ${fdnum} on garbage collection`,
  ],
  'DeprecationWarning': [[deprecationWarning, 'DEP0137']]
});
global.gc();
setTimeout(() => {}, 10);
