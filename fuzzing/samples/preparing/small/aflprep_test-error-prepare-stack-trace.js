'use strict';
const assert = require('assert');
{
  let prepareCalled = false;
  Error.prepareStackTrace = (_error, trace) => {
    prepareCalled = true;
  };
  try {
    throw new Error('foo');
  } catch (err) {
  }
  assert(prepareCalled);
}
