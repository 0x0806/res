'use strict';
const assert = require('assert');
const { UV_EAI_MEMORY } = internalBinding('uv');
const memoryError = errors.dnsException(UV_EAI_MEMORY, 'fhqwhgads');
assert.strictEqual(memoryError.code, 'EAI_MEMORY');
