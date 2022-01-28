'use strict';
const domain = require('domain');
function test() {
  const d = domain.create();
  d.run(function() {
    process.nextTick(function() {
      throw new Error('boom!');
    });
  });
}
if (process.argv[2] === 'child') {
  test();
} else {
  common.childShouldThrowAndAbort();
}
