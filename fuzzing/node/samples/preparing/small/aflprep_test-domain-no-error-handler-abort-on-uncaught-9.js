'use strict';
const domain = require('domain');
function test() {
  const d = domain.create();
  const d2 = domain.create();
  d.on('error', function errorHandler() {
  });
  d.run(() => {
    d2.run(() => {
      const fs = require('fs');
        throw new Error('boom!');
      });
    });
  });
}
if (process.argv[2] === 'child') {
  test();
} else {
  common.childShouldThrowAndAbort();
}
