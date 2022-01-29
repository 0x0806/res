'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const inspector = require('inspector');
const session = new inspector.Session();
session.connect();
process.env.TESTVAR = 'foobar';
session.post('Runtime.evaluate', {
  expression: 'process.env.TESTVAR',
  throwOnSideEffect: true
}, (error, res) => {
  assert.ifError(error);
  assert.deepStrictEqual(res, {
    result: { type: 'string', value: 'foobar' }
  });
});
