'use strict';
if (!common.isMainThread) {
  common.skip('Worker bootstrapping works differently -> different timing');
}
setImmediate(common.mustNotCall()).unref();
