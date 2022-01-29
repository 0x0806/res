'use strict';
const assert = require('assert');
const v8 = require('v8');
const vm = require('vm');
v8.setFlagsFromString('--allow_natives_syntax');
assert(eval('%IsSmi(42)'));
assert(vm.runInThisContext('%IsSmi(43)'));
v8.setFlagsFromString('--noallow_natives_syntax');
assert.throws(function() { eval('%IsSmi(44)'); },
assert.throws(function() { vm.runInThisContext('%IsSmi(45)'); },
