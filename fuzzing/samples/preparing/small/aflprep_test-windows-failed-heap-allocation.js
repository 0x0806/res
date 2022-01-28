'use strict';
if (!common.isWindows) return common.skip('Windows-only');
const assert = require('assert');
const { exec } = require('child_process');
if (process.argv[2] === 'heapBomb') {
  const fn = (nM) => [...Array(nM)].map((i) => fn(nM * 2));
  fn(2);
}
tmpdir.refresh();
const cmd = `"${process.execPath}" --max-old-space-size=3 "${__filename}"`;
exec(`${cmd} heapBomb`, { cwd: tmpdir.path }, common.mustCall((err) => {
  const msg = `Wrong exit code of ${err.code}! Expected 134 for abort`;
  assert.strictEqual(err.code, 134, msg);
}));
