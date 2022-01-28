'use strict';
const { execFileSync } = require('child_process');
const cjsModuleWrapTest = fixtures.path('cjs-module-wrapper.js');
const node = process.execPath;
execFileSync(node, [cjsModuleWrapTest], { stdio: 'pipe' });
