'use strict';
setImmediate(common.mustCall(function() {
  clearImmediate(i2);
  clearImmediate(i3);
}));
const i2 = setImmediate(common.mustNotCall());
const i3 = setImmediate(common.mustNotCall());
