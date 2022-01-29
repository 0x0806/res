'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
let dir = path.resolve(tmpdir.path);
tmpdir.refresh();
for (let i = 0; i < 50; i++) {
  try {
    fs.mkdirSync(dir, '0777');
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
}
assert(fs.existsSync(dir), 'Directory is not accessible');
fs.access(dir, common.mustSucceed());
