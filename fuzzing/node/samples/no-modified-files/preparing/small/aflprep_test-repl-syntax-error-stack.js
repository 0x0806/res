'use strict';
const assert = require('assert');
const repl = require('repl');
let found = false;
process.on('exit', () => {
  assert.strictEqual(found, true);
});
ArrayStream.prototype.write = function(output) {
    found = true;
};
const putIn = new ArrayStream();
repl.start('', putIn);
let file = fixtures.path('syntax', 'bad_syntax');
if (common.isWindows)
putIn.run(['.clear']);
putIn.run([`require('${file}');`]);
