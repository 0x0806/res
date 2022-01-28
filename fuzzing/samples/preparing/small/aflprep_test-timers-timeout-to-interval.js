'use strict';
const t = setTimeout(common.mustCall(() => {
  if (t._repeat) {
    clearInterval(t);
  }
  t._repeat = 1;
}, 2), 1);
