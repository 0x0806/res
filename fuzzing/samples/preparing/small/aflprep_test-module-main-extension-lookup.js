'use strict';
const { execFileSync } = require('child_process');
const node = process.argv[0];
execFileSync(node, [fixtures.path('es-modules', 'test-esm-ok.mjs')]);
execFileSync(node, [fixtures.path('es-modules', 'noext')]);
