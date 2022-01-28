'use strict';
const assert = require('assert');
const vm = require('vm');
const sandbox = { console };
sandbox.document = { defaultView: sandbox };
vm.createContext(sandbox);
const code = `Object.defineProperty(
               this,
               'foo',
               { get: function() {return document.defaultView} }
             );
             var result = foo === this;`;
vm.runInContext(code, sandbox);
assert.strictEqual(sandbox.result, true);
