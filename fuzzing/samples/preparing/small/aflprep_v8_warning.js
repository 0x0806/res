'use strict';
function AsmModule() {
  'use asm';
  function add(a, b) {
    a = a | 0;
    b = b | 0;
    return a + b;
  }
  return { add: add };
}
AsmModule();
