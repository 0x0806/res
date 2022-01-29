'use strict';
process.on('uncaughtException', common.mustCall());
runMakeCallback(5, common.mustCall(() => {
  throw new Error('foo');
}));
