'use strict';
if (!common.isMainThread)
  common.skip('execArgv does not affect Workers');
process.on('exit', () => {
  for (const start = Date.now(); Date.now() - start < 10;);
});
