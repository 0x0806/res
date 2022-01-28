'use strict';
const assert = require('assert');
{
  const allowed = [2, 3];
  assert.throws(() => validateOneOf(1, 'name', allowed), {
    code: 'ERR_INVALID_ARG_VALUE',
    message: `The argument 'name' must be one of: 2, 3. Received 1`
  });
}
{
  validateOneOf(2, 'name', [1, 2]);
}
{
  const allowed = ['b', 'c'];
  assert.throws(() => validateOneOf('a', 'name', allowed), {
    code: 'ERR_INVALID_ARG_VALUE',
    message: `The argument 'name' must be one of: 'b', 'c'. Received 'a'`
  });
}
{
  validateOneOf('two', 'name', ['one', 'two']);
}
{
  const allowed = [Symbol.for('b'), Symbol.for('c')];
  assert.throws(() => validateOneOf(Symbol.for('a'), 'name', allowed), {
    code: 'ERR_INVALID_ARG_VALUE',
    message: `The argument 'name' must be one of: Symbol(b), Symbol(c). ` +
      'Received Symbol(a)'
  });
}
{
  const allowed = [Symbol.for('b'), Symbol.for('c')];
  validateOneOf(Symbol.for('b'), 'name', allowed);
}
