'use strict';
const assert = require('assert');
process.externalBuffer = binding.newExternalBuffer();
assert.strictEqual(process.externalBuffer.toString(), binding.theText);
