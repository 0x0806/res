'use strict';
const fs = require('fs');
common.expectWarning(
  'DeprecationWarning',
  'ReadStream.prototype.open() is deprecated', 'DEP0135');
const s = fs.createReadStream('asd')
  .on('error', () => {});
s.open();
process.nextTick(() => {
  fs.ReadStream.prototype.open = common.mustCall();
  fs.createReadStream('asd');
});
