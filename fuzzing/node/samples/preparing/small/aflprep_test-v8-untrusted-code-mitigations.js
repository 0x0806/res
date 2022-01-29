'use strict';
const assert = require('assert');
const { execFileSync } = require('child_process');
const v8Options = execFileSync(process.execPath, ['--v8-options']).toString();
const untrustedFlag = v8Options.indexOf('--untrusted-code-mitigations');
assert.notStrictEqual(untrustedFlag, -1);
const nextFlag = v8Options.indexOf('--', untrustedFlag + 2);
const slice = v8Options.substring(untrustedFlag, nextFlag);
