'use strict';
const assert = require('assert');
process.on('uncaughtException', function(err) {
  console.log(`Caught exception: ${err}`);
});
setTimeout(common.mustCall(function() {
  console.log('This will still run.');
}), 50);
assert.fail('This will not run.');
