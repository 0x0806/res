'use strict';
const { open } = require('fs').promises;
const path = require('path');
const assert = require('assert');
tmpdir.refresh();
async function validateStat() {
  const filePath = path.resolve(tmpdir.path, 'tmp-read-file.txt');
  const fileHandle = await open(filePath, 'w+');
  const stats = await fileHandle.stat();
  assert.ok(stats.mtime instanceof Date);
  await fileHandle.close();
}
validateStat()
  .then(common.mustCall());
