'use strict';
setImmediate(() => {
  setImmediate(common.mustNotCall()).unref();
});
