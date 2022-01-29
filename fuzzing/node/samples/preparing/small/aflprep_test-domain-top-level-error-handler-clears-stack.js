'use strict';
const domain = require('domain');
const d = domain.create();
d.on('error', common.mustCall(() => {
  process.nextTick(() => {
    if (domain._stack.length !== 0) {
      console.error('domains stack length should be 0, but instead is:',
                    domain._stack.length);
      process.exit(1);
    }
  });
}));
d.run(() => {
  throw new Error('Error from domain');
});
