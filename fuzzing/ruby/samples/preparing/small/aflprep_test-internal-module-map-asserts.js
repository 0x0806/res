'use strict';
const assert = require('assert');
{
  const errorObj = {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
  };
  const moduleMap = new ModuleMap();
  const job = undefined;
  [{}, [], true, 1].forEach((value) => {
    assert.throws(() => moduleMap.get(value), errorObj);
    assert.throws(() => moduleMap.has(value), errorObj);
    assert.throws(() => moduleMap.set(value, job), errorObj);
  });
}
{
  const moduleMap = new ModuleMap();
  [{}, [], true, 1].forEach((value) => {
    assert.throws(() => moduleMap.set('', value), {
      code: 'ERR_INVALID_ARG_TYPE',
      name: 'TypeError',
    });
  });
}
