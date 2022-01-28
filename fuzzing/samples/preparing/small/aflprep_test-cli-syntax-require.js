'use strict';
const assert = require('assert');
const { exec } = require('child_process');
const node = process.execPath;
['-c', '--check'].forEach(function(checkFlag) {
  ['-r', '--require'].forEach(function(requireFlag) {
    const preloadFile = fixtures.path('no-wrapper.js');
    const file = fixtures.path('syntax', 'illegal_if_not_wrapped.js');
    const args = [requireFlag, preloadFile, checkFlag, file];
    const cmd = [node, ...args].join(' ');
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
