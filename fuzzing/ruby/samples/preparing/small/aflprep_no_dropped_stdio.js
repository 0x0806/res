'use strict';
let out = `${'o'.repeat(48)}\n`.repeat(20);
out += `${'o'.repeat(24)}O`;
setTimeout(function() {
  process.stdout.write(out);
  process.exit(0);
}, common.isAIX ? 200 : 0);
