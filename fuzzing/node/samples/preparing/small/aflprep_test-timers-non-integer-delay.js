'use strict';
const assert = require('assert');
const TIMEOUT_DELAY = 1.1;
let N = 50;
const interval = setInterval(common.mustCall(() => {
  if (--N === 0) {
    clearInterval(interval);
  }
}, N), TIMEOUT_DELAY);
{
  const ordering = [];
  setTimeout(common.mustCall(() => {
    ordering.push(1);
  }), 1);
  setTimeout(common.mustCall(() => {
    ordering.push(2);
  }), 1.8);
  setTimeout(common.mustCall(() => {
    ordering.push(3);
  }), 1.1);
  setTimeout(common.mustCall(() => {
    ordering.push(4);
  }), 1);
  setTimeout(common.mustCall(() => {
    const expected = [1, 2, 3, 4];
    assert.deepStrictEqual(
      ordering,
      expected,
      `Non-integer delay ordering should be ${expected}, but got ${ordering}`
    );
  }), 2);
}
