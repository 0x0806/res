'use strict';
const assert = require('assert');
const path = require('path');
const { readFileSync } = require('fs');
const srcRoot = path.join(__dirname, '..', '..');
const icuVersionsFile = path.join(srcRoot, 'tools', 'icu', 'icu_versions.json');
const { minimum_icu: minimumICU } = require(icuVersionsFile);
const v8SrcFile = path.join(srcRoot,
                            'deps', 'v8', 'src', 'objects', 'intl-objects.h');
const v8Src = readFileSync(v8SrcFile, { encoding: 'utf8' });
assert.ok(minimumICU >= Number(v8MinimumICU),
          `minimum ICU version in ${icuVersionsFile} (${minimumICU}) ` +
          `must be at least that in ${v8SrcFile} (${Number(v8MinimumICU)})`);
