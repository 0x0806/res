'use strict';
const assert = require('assert');
const http = require('http');
const vals = [{}, [], NaN, Infinity, -Infinity, true, false, 1, 0, new Date()];
vals.forEach((v) => {
  const received = common.invalidArgTypeHelper(v);
  assert.throws(
    () => http.request({ hostname: v }),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "options.hostname" property must be of ' +
               'type string or one of undefined or null.' +
               received
    }
  );
  assert.throws(
    () => http.request({ host: v }),
    {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
      message: 'The "options.host" property must be of ' +
               'type string or one of undefined or null.' +
               received
    }
  );
});
const dontCare = () => {};
['', undefined, null].forEach((v) => {
  http.request({ hostname: v }).on('error', dontCare).end();
  http.request({ host: v }).on('error', dontCare).end();
});
