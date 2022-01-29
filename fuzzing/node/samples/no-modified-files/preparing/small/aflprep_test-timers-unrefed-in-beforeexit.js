'use strict';
process.on('beforeExit', common.mustCall(() => {
  setTimeout(common.mustNotCall(), 1).unref();
}));
