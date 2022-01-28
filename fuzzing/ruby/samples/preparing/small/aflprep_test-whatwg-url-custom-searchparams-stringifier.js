'use strict';
const assert = require('assert');
{
  const params = new URLSearchParams();
  assert.throws(() => {
    params.toString.call(undefined);
  }, {
    code: 'ERR_INVALID_THIS',
    name: 'TypeError',
    message: 'Value of "this" must be of type URLSearchParams'
  });
}
{
  assert.strictEqual(myUrl.search, '?foo=~bar');
  myUrl.searchParams.sort();
  assert.strictEqual(myUrl.search, '?foo=%7Ebar');
}
