'use strict';
const assert = require('assert');
const { exec } = require('child_process');
const node = process.execPath;
const syntaxArgs = [
  ['-c'],
  ['--check'],
];
[
].forEach(function(file) {
  file = fixtures.path(file);
  syntaxArgs.forEach(function(args) {
    const _args = args.concat(file);
    const cmd = [node, ..._args].join(' ');
    exec(cmd, common.mustCall((err, stdout, stderr) => {
      assert.strictEqual(err instanceof Error, true);
      assert.strictEqual(err.code, 1,
                         `code ${err.code} !== 1 for error:\n\n${err}`);
      assert.strictEqual(stdout, '');
      assert.match(stderr, syntaxErrorRE);
      assert(stderr.startsWith(file), `${stderr} starts with ${file}`);
    }));
  });
});
