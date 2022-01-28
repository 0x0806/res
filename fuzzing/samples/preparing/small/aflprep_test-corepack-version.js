'use strict';
const path = require('path');
const assert = require('assert');
const corepackPathPackageJson = path.resolve(
  __dirname,
  '..',
  '..',
  'deps',
  'corepack',
  'package.json'
);
const pkg = require(corepackPathPackageJson);
       `unexpected version number: ${pkg.version}`);
