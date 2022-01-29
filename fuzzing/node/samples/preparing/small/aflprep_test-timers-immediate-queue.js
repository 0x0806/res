'use strict';
const assert = require('assert');
let ticked = false;
let hit = 0;
const QUEUE = 10;
function run() {
  if (hit === 0) {
    setTimeout(() => { ticked = true; }, 1);
    const now = Date.now();
    while (Date.now() - now < 2);
  }
  if (ticked) return;
  hit += 1;
  setImmediate(run);
}
for (let i = 0; i < QUEUE; i++)
  setImmediate(run);
process.on('exit', function() {
  console.log('hit', hit);
  assert.strictEqual(hit, QUEUE);
});
