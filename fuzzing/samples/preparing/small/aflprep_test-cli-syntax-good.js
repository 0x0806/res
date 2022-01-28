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
      if (err) {
        console.log('-- stdout --');
        console.log(stdout);
        console.log('-- stderr --');
        console.log(stderr);
      }
      assert.ifError(err);
      assert.strictEqual(stdout, '');
      assert.strictEqual(stderr, '');
    }));
  });
});
