'use strict';
const asyncHooks = require('async_hooks');
const vm = require('vm');
const hook = asyncHooks.createHook({ init() {} }).enable();
vm.createContext();
globalThis.gc();
hook.disable();
