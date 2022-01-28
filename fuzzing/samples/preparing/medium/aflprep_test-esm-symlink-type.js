'use strict';
const path = require('path');
const assert = require('assert');
const exec = require('child_process').execFile;
const fs = require('fs');
tmpdir.refresh();
const tmpDir = tmpdir.path;
const symlinks = [
  {
    source: 'extensionless-symlink-to-mjs-file',
    prints: '.mjs file',
    errorsWithPreserveSymlinksMain: false
  }, {
    source: 'extensionless-symlink-to-cjs-file',
    prints: '.cjs file',
    errorsWithPreserveSymlinksMain: false
  }, {
    source: 'extensionless-symlink-to-file-in-module-scope',
    prints: 'package-type-module',
    errorsWithPreserveSymlinksMain: true
  }, {
    source: 'extensionless-symlink-to-file-in-explicit-commonjs-scope',
    prints: 'package-type-commonjs',
    errorsWithPreserveSymlinksMain: false
  }, {
    source: 'extensionless-symlink-to-file-in-implicit-commonjs-scope',
    prints: 'package-without-type',
    errorsWithPreserveSymlinksMain: false
  },
];
symlinks.forEach((symlink) => {
  const mainPath = path.join(tmpDir, symlink.source);
  fs.symlinkSync(symlink.target, mainPath);
  const flags = [
    '',
    '--preserve-symlinks-main',
  ];
  flags.forEach((nodeOptions) => {
    const opts = {
      env: Object.assign({}, process.env, { NODE_OPTIONS: nodeOptions })
    };
    exec(process.execPath, [mainPath], opts, common.mustCall(
      (err, stdout) => {
        if (nodeOptions.includes('--preserve-symlinks-main')) {
          if (symlink.errorsWithPreserveSymlinksMain &&
              err.toString().includes('Error')) return;
          else if (!symlink.errorsWithPreserveSymlinksMain &&
                    stdout.includes(symlink.prints)) return;
          assert.fail(`For ${JSON.stringify(symlink)}, ${
            (symlink.errorsWithPreserveSymlinksMain) ?
              'failed to error' : 'errored unexpectedly'
          } with --preserve-symlinks-main`);
        } else {
          if (stdout.includes(symlink.prints)) return;
          assert.fail(`For ${JSON.stringify(symlink)}, failed to find ` +
            `${symlink.prints} in: <\n${stdout}\n>`);
        }
      }
    ));
  });
});
