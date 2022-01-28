'use strict';
const assert = require('assert');
const repl = require('repl');
const zlib = require('zlib');
const putIn = zlib.createGzip();
const testMe = repl.start('', putIn, function(cmd, context, filename,
                                              callback) {
  callback(null, cmd);
});
testMe._domain.on('error', common.mustNotCall());
testMe.complete('', function(err, results) {
  assert.strictEqual(err, null);
});
