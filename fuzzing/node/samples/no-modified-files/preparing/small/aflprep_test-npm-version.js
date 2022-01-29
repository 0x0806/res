'use strict';
const path = require('path');
const assert = require('assert');
const npmPathPackageJson = path.resolve(
  __dirname,
  '..',
  '..',
  'deps',
  'npm',
  'package.json'
);
const pkg = require(npmPathPackageJson);
       `unexpected version number: ${pkg.version}`);
