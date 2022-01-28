'use strict';
if (isCPPSymbolsNotMapped) {
  common.skip('C++ symbols are not mapped for this os.');
}
base.runTest({
  code: `function f() {
           require('vm').createContext({});
           setImmediate(function() { f(); });
         };
         f();`
});
