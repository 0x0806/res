'use strict';
let didCall = false;
const timer = setTimeout(common.mustCall(() => {
  if (!didCall) {
    didCall = true;
    timer.refresh();
  }
}, 2), 1);
