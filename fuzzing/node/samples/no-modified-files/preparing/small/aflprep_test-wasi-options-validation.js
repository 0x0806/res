'use strict';
const assert = require('assert');
const { WASI } = require('wasi');
new WASI({});
assert.throws(() => { new WASI({ args: 'fhqwhgads' }); },
assert.throws(() => { new WASI({ env: 'fhqwhgads' }); },
assert.throws(() => { new WASI({ preopens: 'fhqwhgads' }); },
assert.throws(() => { new WASI({ returnOnExit: 'fhqwhgads' }); },
assert.throws(() => { new WASI({ stdin: 'fhqwhgads' }); },
assert.throws(() => { new WASI({ stdout: 'fhqwhgads' }); },
assert.throws(() => { new WASI({ stderr: 'fhqwhgads' }); },
[null, 'foo', '', 0, NaN, Symbol(), true, false, () => {}].forEach((value) => {
  assert.throws(() => { new WASI(value); },
                { code: 'ERR_INVALID_ARG_TYPE' });
});
assert.throws(() => {
