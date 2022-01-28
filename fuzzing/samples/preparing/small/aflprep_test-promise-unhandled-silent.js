'use strict';
new Promise(() => {
  throw new Error('One');
});
Promise.reject('test');
process.on('warning', common.mustNotCall('warning'));
process.on('uncaughtException', common.mustNotCall('uncaughtException'));
process.on('rejectionHandled', common.mustNotCall('rejectionHandled'));
process.on('unhandledRejection', common.mustCall(2));
setTimeout(common.mustCall(), 2);
