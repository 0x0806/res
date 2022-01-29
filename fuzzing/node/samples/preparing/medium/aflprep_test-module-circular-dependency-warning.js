'use strict';
const assert = require('assert');
common.expectWarning({
  Warning: [
    ["Accessing non-existent property 'missingPropB' " +
     'of module exports inside circular dependency'],
    ["Accessing non-existent property 'Symbol(someSymbol)' " +
     'of module exports inside circular dependency'],
    ["Accessing non-existent property 'missingPropModuleExportsB' " +
     'of module exports inside circular dependency'],
  ]
});
const required = require(fixtures.path('cycles', 'warning-a.js'));
assert.strictEqual(Object.getPrototypeOf(required), Object.prototype);
const requiredWithModuleExportsOverridden =
  require(fixtures.path('cycles', 'warning-moduleexports-a.js'));
assert.strictEqual(Object.getPrototypeOf(requiredWithModuleExportsOverridden),
                   Object.prototype);
const classExport =
  require(fixtures.path('cycles', 'warning-moduleexports-class-a.js'));
assert.strictEqual(Object.getPrototypeOf(classExport).name, 'Parent');
const esmTranspiledExport =
  require(fixtures.path('cycles', 'warning-esm-transpiled-a.js'));
assert.strictEqual(esmTranspiledExport.__esModule, true);
const halfTranspiledExport =
  require(fixtures.path('cycles', 'warning-esm-half-transpiled-a.js'));
assert.strictEqual(halfTranspiledExport.__esModule, undefined);
require(fixtures.path('cycles', 'warning-skip-proxy-traps-a.js'));
