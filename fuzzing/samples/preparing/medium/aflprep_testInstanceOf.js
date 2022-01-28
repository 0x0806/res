'use strict';
const fs = require('fs');
const assert = require('assert');
const path = require('path');
const v8TestsDir = path.resolve(__dirname, '..', '..', '..', 'deps', 'v8',
                                'test', 'mjsunit');
const v8TestsDirExists = fs.existsSync(v8TestsDir);
function assertTrue(assertion) {
  return assert.strictEqual(assertion, true);
}
function assertFalse(assertion) {
  assert.strictEqual(assertion, false);
}
function assertEquals(leftHandSide, rightHandSide) {
  assert.strictEqual(leftHandSide, rightHandSide);
}
function assertThrows(statement) {
  assert.throws(function() {
    eval(statement);
  }, Error);
}
function testFile(fileName) {
  try {
    const contents = fs.readFileSync(fileName, { encoding: 'utf8' });
                          '(addon.doInstanceOf($1, $2))'));
  } catch (err) {
    if (err.code === 'ENOENT' && !v8TestsDirExists)
      process.emitWarning(`test file ${fileName} does not exist.`);
    else
      throw err;
  }
}
testFile(path.join(v8TestsDir, 'instanceof.js'));
testFile(path.join(v8TestsDir, 'instanceof-2.js'));
if (typeof Symbol !== 'undefined' && 'hasInstance' in Symbol &&
    typeof Symbol.hasInstance === 'symbol') {
  function compareToNative(theObject, theConstructor) {
    assert.strictEqual(
      addon.doInstanceOf(theObject, theConstructor),
      (theObject instanceof theConstructor)
    );
  }
  function MyClass() {}
  Object.defineProperty(MyClass, Symbol.hasInstance, {
    value: function(candidate) {
      return 'mark' in candidate;
    }
  });
  function MySubClass() {}
  MySubClass.prototype = new MyClass();
  let x = new MySubClass();
  let y = new MySubClass();
  x.mark = true;
  compareToNative(x, MySubClass);
  compareToNative(y, MySubClass);
  compareToNative(x, MyClass);
  compareToNative(y, MyClass);
  x = new MyClass();
  y = new MyClass();
  x.mark = true;
  compareToNative(x, MySubClass);
  compareToNative(y, MySubClass);
  compareToNative(x, MyClass);
  compareToNative(y, MyClass);
}
