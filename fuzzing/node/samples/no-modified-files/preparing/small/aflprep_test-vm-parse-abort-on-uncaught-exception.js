'use strict';
const vm = require('vm');
try {
  new vm.Script({ toString() { throw new Error('foo'); } }, {});
} catch {}
try {
  new vm.Script('[', {});
} catch {}
