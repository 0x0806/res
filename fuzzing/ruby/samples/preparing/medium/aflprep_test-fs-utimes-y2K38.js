'use strict';
tmpdir.refresh();
const assert = require('assert');
const fs = require('fs');
if (!common.isWindows) {
  const testFileDate = '204001020304';
  const { spawnSync } = require('child_process');
  const touchResult = spawnSync('touch',
                                ['-t', testFileDate, testFilePath],
                                { encoding: 'utf8' });
  if (touchResult.status !== 0) {
    common.skip('File system appears to lack Y2K38 support (touch failed)');
  }
  const dateResult = spawnSync('date',
                               ['-r', testFilePath, '+%Y%m%d%H%M'],
                               { encoding: 'utf8' });
  if (dateResult.status === 0) {
    if (dateResult.stdout.trim() !== testFileDate) {
      common.skip('File system appears to lack Y2k38 support (date failed)');
    }
  } else {
  }
}
fs.writeFileSync(path, '');
const Y2K38_mtime = 2 ** 31;
fs.utimesSync(path, Y2K38_mtime, Y2K38_mtime);
const Y2K38_stats = fs.statSync(path);
if (common.isWindows) {
  const truncate_mtime = 1713037251360;
  const truncate_stats = fs.statSync(path);
  assert.strictEqual(truncate_stats.mtime.getTime(), truncate_mtime);
  const overflow_mtime = 2159345162531;
  const overflow_stats = fs.statSync(path);
  assert.strictEqual(overflow_stats.mtime.getTime(), overflow_mtime);
}
