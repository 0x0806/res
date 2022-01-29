'use strict';
const assert = require('assert');
const binding = internalBinding('util');
const spawnSync = require('child_process').spawnSync;
const kArrowMessagePrivateSymbolIndex = binding.arrow_message_private_symbol;
const kDecoratedPrivateSymbolIndex = binding.decorated_private_symbol;
const decorateErrorStack = internalUtil.decorateErrorStack;
decorateErrorStack();
decorateErrorStack(null);
decorateErrorStack(1);
decorateErrorStack(true);
const obj = {};
decorateErrorStack(obj);
assert.strictEqual(obj.stack, undefined);
function checkStack(stack) {
}
let err;
const badSyntaxPath =
try {
  require(badSyntaxPath);
} catch (e) {
  err = e;
}
assert(typeof err, 'object');
checkStack(err.stack);
decorateErrorStack(err);
decorateErrorStack(err);
checkStack(err.stack);
const args = [
  '-e',
  `require('${badSyntaxPath}')`,
];
const result = spawnSync(process.argv[0], args, { encoding: 'utf8' });
checkStack(result.stderr);
err = new Error('foo');
let originalStack = err.stack;
decorateErrorStack(err);
assert.strictEqual(originalStack, err.stack);
const arrowMessage = 'arrow_message';
err = new Error('foo');
originalStack = err.stack;
binding.setHiddenValue(err, kArrowMessagePrivateSymbolIndex, arrowMessage);
decorateErrorStack(err);
assert.strictEqual(err.stack, `${arrowMessage}${originalStack}`);
assert.strictEqual(
  binding.getHiddenValue(err, kDecoratedPrivateSymbolIndex), true);
