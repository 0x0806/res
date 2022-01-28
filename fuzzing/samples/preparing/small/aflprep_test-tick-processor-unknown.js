'use strict';
if (common.isAIX)
  common.skip('AIX address range too big for scripts.');
base.runTest({
  code: `function f() {
           for (let i = 0; i < 1000000; i++) {
             i++;
           }
           setImmediate(function() { f(); });
         };
         f();`
});
