'use strict';
const { strictEqual, throws } = require('assert');
throws(() => {
  const err = new NghttpError(-501);
  strictEqual(err.errno, -501);
  throw err;
}, {
  code: 'ERR_HTTP2_ERROR',
  constructor: NghttpError,
  message: 'Invalid argument'
});
{
  const err = new NghttpError(401);
  strictEqual(err.toString(), 'Error [ERR_HTTP2_ERROR]: Unknown error code');
}
