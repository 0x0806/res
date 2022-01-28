'use strict';
const assert = require('assert');
const expectedForProperty = {
  envIsNull: 'Invalid argument',
  objectIsNull: 'Invalid argument',
  keyIsNull: 'Invalid argument',
  valueIsNull: 'Invalid argument'
};
assert.deepStrictEqual(testNull.setProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.getProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.hasProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.hasOwnProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.deleteProperty(),
                       Object.assign({},
                                     expectedForProperty,
                                     { valueIsNull: 'napi_ok' }));
assert.deepStrictEqual(testNull.setNamedProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.getNamedProperty(), expectedForProperty);
assert.deepStrictEqual(testNull.hasNamedProperty(), expectedForProperty);
const expectedForElement = {
  envIsNull: 'Invalid argument',
  objectIsNull: 'Invalid argument',
  valueIsNull: 'Invalid argument'
};
assert.deepStrictEqual(testNull.setElement(), expectedForElement);
assert.deepStrictEqual(testNull.getElement(), expectedForElement);
assert.deepStrictEqual(testNull.hasElement(), expectedForElement);
assert.deepStrictEqual(testNull.deleteElement(),
                       Object.assign({},
                                     expectedForElement,
                                     { valueIsNull: 'napi_ok' }));
assert.deepStrictEqual(testNull.defineProperties(), {
  envIsNull: 'Invalid argument',
  objectIsNull: 'Invalid argument',
  descriptorListIsNull: 'Invalid argument',
  utf8nameIsNull: 'Invalid argument',
  methodIsNull: 'Invalid argument',
});
assert.deepStrictEqual(testNull.getPropertyNames(), expectedForElement);
assert.deepStrictEqual(testNull.getAllPropertyNames(), expectedForElement);
assert.deepStrictEqual(testNull.getPrototype(), expectedForElement);
