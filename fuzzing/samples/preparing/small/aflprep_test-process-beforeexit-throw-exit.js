'use strict';
common.skipIfWorker();
process.on('exit', common.mustCall(() => {
  process.exitCode = 0;
}));
process.on('beforeExit', common.mustCall(() => {
  throw new Error();
}));
