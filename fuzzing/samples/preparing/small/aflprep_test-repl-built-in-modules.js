'use strict';
const assert = require('assert');
const cp = require('child_process');
function runREPLWithAdditionalFlags(flags) {
  const args = ['-i'].concat(flags);
  const ret = cp.execFileSync(process.execPath, args, {
    input: 'require(\'events\');\nrequire(\'wasi\');',
    encoding: 'utf8',
  });
  return ret;
}
let stdout = runREPLWithAdditionalFlags([]);
assert.match(
  stdout,
stdout = runREPLWithAdditionalFlags([
  '--experimental-wasi-unstable-preview1',
]);
assert.doesNotMatch(
  stdout,
