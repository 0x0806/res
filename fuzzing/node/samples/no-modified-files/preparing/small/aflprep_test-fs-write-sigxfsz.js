'use strict';
const assert = require('assert');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
if (common.isWindows)
  common.skip('no RLIMIT_FSIZE on Windows');
if (process.config.variables.node_shared)
  common.skip('SIGXFSZ signal handler not installed in shared library mode');
if (process.argv[2] === 'child') {
  const filename = path.join(tmpdir.path, 'efbig.txt');
  tmpdir.refresh();
} else {
  const cmd = `ulimit -f 1 && '${process.execPath}' '${__filename}' child`;
  const haystack = result.stderr.toString();
  const needle = 'Error: EFBIG: file too large, write';
  const ok = haystack.includes(needle);
  if (!ok) console.error(haystack);
  assert(ok);
  assert.strictEqual(result.status, 1);
  assert.strictEqual(result.stdout.toString(), '');
}
