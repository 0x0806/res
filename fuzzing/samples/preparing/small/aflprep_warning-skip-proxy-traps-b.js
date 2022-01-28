const assert = require('assert');
assert.throws(() => {
  object.missingPropProxyTrap;
}, {
  message: 'get: missingPropProxyTrap',
  name: 'Error',
});
