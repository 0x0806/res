'use strict';
const N = 3;
function next() {
  const fn = common.mustCall(() => clearImmediate(immediate));
  const immediate = setImmediate(fn);
}
for (let i = 0; i < N; i++) {
  next();
}
