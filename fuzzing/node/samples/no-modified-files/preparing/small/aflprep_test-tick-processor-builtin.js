'use strict';
if (isCPPSymbolsNotMapped) {
  common.skip('C++ symbols are not mapped for this os.');
}
base.runTest({
  code: `function f() {
           this.ts = Date.now();
           setImmediate(function() { new f(); });
         };
         f();`
});
