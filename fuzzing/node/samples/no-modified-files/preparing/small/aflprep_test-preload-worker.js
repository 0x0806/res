'use strict';
const worker = fixtures.path('worker-preload.js');
const { exec } = require('child_process');
const kNodeBinary = process.argv[0];
exec(`"${kNodeBinary}" -r "${worker}" -pe "1+1"`, common.mustSucceed());
