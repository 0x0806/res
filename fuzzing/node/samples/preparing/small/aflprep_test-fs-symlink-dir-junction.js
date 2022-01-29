'use strict';
const assert = require('assert');
const path = require('path');
const fs = require('fs');
const linkPath = path.join(tmpdir.path, 'cycles_link');
tmpdir.refresh();
fs.symlink(linkData, linkPath, 'junction', common.mustSucceed(() => {
  fs.lstat(linkPath, common.mustSucceed((stats) => {
    assert.ok(stats.isSymbolicLink());
    fs.readlink(linkPath, common.mustSucceed((destination) => {
      assert.strictEqual(destination, linkData);
      fs.unlink(linkPath, common.mustSucceed(() => {
        assert(!fs.existsSync(linkPath));
        assert(fs.existsSync(linkData));
      }));
    }));
  }));
}));
{
  const linkPath = path.join(tmpdir.path, 'invalid_junction_link');
  fs.symlink(linkData, linkPath, 'junction', common.mustSucceed(() => {
    assert(!fs.existsSync(linkPath));
    fs.unlink(linkPath, common.mustSucceed(() => {
      assert(!fs.existsSync(linkPath));
    }));
  }));
}
