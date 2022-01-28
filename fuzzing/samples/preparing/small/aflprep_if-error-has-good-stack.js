'use strict';
const assert = require('assert');
let err;
(function a() {
  (function b() {
    (function c() {
      err = new Error('test error');
    })();
  })();
})();
(function x() {
  (function y() {
    (function z() {
      assert.ifError(err);
    })();
  })();
})();
