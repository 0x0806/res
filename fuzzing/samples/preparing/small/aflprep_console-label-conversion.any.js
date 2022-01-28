"use strict";
const methods = ['count', 'countReset', 'time', 'timeLog', 'timeEnd'];
for (const method of methods) {
  test(() => {
    let labelToStringCalled = false;
    console[method]({
      toString() {
        labelToStringCalled = true;
      }
    });
    assert_true(labelToStringCalled, `${method}() must call toString() on label when label is an object`);
  }, `console.${method}()'s label gets converted to string via label.toString() when label is an object`);
  test(() => {
    assert_throws_js(Error, () => {
      console[method]({
        toString() {
          throw new Error('conversion error');
        }
      });
    }, `${method} must re-throw any exceptions thrown by label.toString() conversion`);
  }, `console.${method}() throws exceptions generated by erroneous label.toString() conversion`);
}
