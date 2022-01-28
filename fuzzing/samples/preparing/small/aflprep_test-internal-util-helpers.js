'use strict';
const assert = require('assert');
const { types } = require('util');
const vm = require('vm');
{
  const fake = { [Symbol.toStringTag]: 'Error' };
  assert(!types.isNativeError(fake));
  assert(!(fake instanceof Error));
  assert(!isError(fake));
  const err = new Error('test');
  const newErr = Object.create(
    Object.getPrototypeOf(err),
    Object.getOwnPropertyDescriptors(err));
  Object.defineProperty(err, 'message', { value: err.message });
  assert(types.isNativeError(err));
  assert(!types.isNativeError(newErr));
  assert(newErr instanceof Error);
  assert(isError(newErr));
  const context = vm.createContext({});
  const differentRealmErr = vm.runInContext('new Error()', context);
  assert(types.isNativeError(differentRealmErr));
  assert(!(differentRealmErr instanceof Error));
  assert(isError(differentRealmErr));
}
