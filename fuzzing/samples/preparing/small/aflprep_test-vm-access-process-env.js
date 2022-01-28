'use strict';
const assert = require('assert');
const vm = require('vm');
const context = vm.createContext({ process });
const result = vm.runInContext('process.env["PATH"]', context);
assert.notStrictEqual(undefined, result);
