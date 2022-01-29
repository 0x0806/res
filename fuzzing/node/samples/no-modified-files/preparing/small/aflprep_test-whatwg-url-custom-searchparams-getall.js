'use strict';
const assert = require('assert');
{
  const params = new URLSearchParams();
  assert.throws(() => {
    params.getAll.call(undefined);
  }, {
    code: 'ERR_INVALID_THIS',
    name: 'TypeError',
    message: 'Value of "this" must be of type URLSearchParams'
  });
  assert.throws(() => {
    params.getAll();
  }, {
    code: 'ERR_MISSING_ARGS',
    name: 'TypeError',
    message: 'The "name" argument must be specified'
  });
  const obj = {
    toString() { throw new Error('toString'); },
    valueOf() { throw new Error('valueOf'); }
  };
  const sym = Symbol();
  assert.throws(() => params.getAll(sym),
}
