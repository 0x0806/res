'use strict';
common.skipIfInspectorDisabled();
const assert = require('assert');
const inspector = require('inspector');
const vm = require('vm');
const session = new inspector.Session();
session.connect();
const context = vm.createContext({
  get a() {
    global.foo = '1';
    return 100;
  }
});
session.post('Runtime.evaluate', {
  expression: 'a',
  throwOnSideEffect: true,
}, (error, res) => {
  assert.ifError(error);
  const { exception } = res.exceptionDetails;
  assert.strictEqual(exception.className, 'EvalError');
});
