'use strict';
const vm = require('vm');
const ctx = vm.createContext(global);
vm.runInContext('!function() { var x = console.log; }()', ctx);
