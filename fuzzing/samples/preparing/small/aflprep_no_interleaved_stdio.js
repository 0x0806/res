'use strict';
let out = `${'o'.repeat(48)}\n`.repeat(20);
out += `${'o'.repeat(24)}O`;
const err = '__This is some stderr__';
setTimeout(function() {
  process.stdout.write(out);
  process.stderr.write(err);
}, common.isAIX ? 200 : 0);
