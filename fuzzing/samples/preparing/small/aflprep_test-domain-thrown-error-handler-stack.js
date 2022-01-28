'use strict';
const domain = require('domain');
const d = domain.create();
const d2 = domain.create();
d2.on('error', common.mustCall((err) => {
  if (domain._stack.length !== 1) {
    console.error('domains stack length should be 1 but is %d',
                  domain._stack.length);
    process.exit(1);
  }
  if (process.domain !== d) {
    console.error('active domain should be %j but is %j', d, process.domain);
    process.exit(1);
  }
  process.nextTick(() => {
    if (domain._stack.length !== 1) {
      console.error('domains stack length should be 1 but is %d',
                    domain._stack.length);
      process.exit(1);
    }
    if (process.domain !== d) {
      console.error('active domain should be %j but is %j', d,
                    process.domain);
      process.exit(1);
    }
  });
}));
d.run(() => {
  d2.run(() => {
    throw new Error('oops');
  });
});
