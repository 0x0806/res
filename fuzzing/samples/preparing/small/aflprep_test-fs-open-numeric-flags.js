'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
tmpdir.refresh();
const pathNE = path.join(tmpdir.path, 'file-should-not-exist');
assert.throws(
  () => fs.openSync(pathNE, fs.constants.O_WRONLY),
  (e) => e.code === 'ENOENT'
);
