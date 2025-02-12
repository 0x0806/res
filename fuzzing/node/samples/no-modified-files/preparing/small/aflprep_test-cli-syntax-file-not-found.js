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
      assert.strictEqual(stdout, '');
      assert.match(stderr, notFoundRE);
      assert.strictEqual(err.code, 1,
                         `code ${err.code} !== 1 for error:\n\n${err}`);
    }));
  });
});
