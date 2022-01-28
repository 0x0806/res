'use strict';
const assert = require('assert');
assert(process.config.variables.hasOwnProperty('node_module_version'));
assert(Number.isInteger(process.config.variables.node_module_version));
assert(process.config.variables.node_module_version > 0);
