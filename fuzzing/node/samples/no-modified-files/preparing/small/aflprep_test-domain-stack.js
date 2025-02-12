'use strict';
const domain = require('domain');
const a = domain.create();
a.name = 'a';
a.on('error', function() {
  if (domain._stack.length > 5) {
    console.error('leaking!', domain._stack);
    process.exit(1);
  }
});
const foo = a.bind(function() {
  throw new Error('error from foo');
});
for (let i = 0; i < 1000; i++) {
  process.nextTick(foo);
}
process.on('exit', function(c) {
  if (!c) console.log('ok');
});
