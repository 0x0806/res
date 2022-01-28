'use strict';
const { execSync } = require('child_process');
execSync(process.execPath, {
  encoding: 'utf8',
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_REPL_EXTERNAL_MODULE: fixtures.path('external-repl-module.js'),
  },
});
