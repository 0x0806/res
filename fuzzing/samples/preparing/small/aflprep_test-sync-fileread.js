'use strict';
const assert = require('assert');
const fs = require('fs');
assert.strictEqual(fs.readFileSync(fixtures.path('x.txt')).toString(), 'xyz\n');
