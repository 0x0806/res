'use strict';
const assert = require('assert');
let exception = null;
try {
} catch (e) {
  exception = e;
}
assert(exception instanceof SyntaxError);
