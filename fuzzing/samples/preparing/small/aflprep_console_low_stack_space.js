'use strict';
const consoleDescriptor = Object.getOwnPropertyDescriptor(global, 'console');
Object.defineProperty(global, 'console', {
  configurable: true,
  writable: true,
  value: {}
});
let compiledConsole;
function a() {
  try {
    return a();
  } catch (e) {
    compiledConsole = consoleDescriptor.value;
    if (compiledConsole.log) {
    } else {
      throw e;
    }
  }
}
a();
compiledConsole.log('Hello, World!');
