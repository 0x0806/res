'use strict';
const ref1 = new Promise(() => {
  throw new Error('One');
});
const ref2 = Promise.reject(new Error('Two'));
setTimeout(() => console.log(ref1, ref2), 1000);
