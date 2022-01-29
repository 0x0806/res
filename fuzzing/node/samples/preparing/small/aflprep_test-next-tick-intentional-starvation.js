'use strict';
const assert = require('assert');
let ran = false;
let starved = false;
const start = +new Date();
let timerRan = false;
function spin() {
  ran = true;
  const now = +new Date();
  if (now - start > 100) {
    console.log('The timer is starving, just as we planned.');
    starved = true;
    return;
  }
  process.nextTick(spin);
}
function onTimeout() {
  if (!starved) throw new Error('The timer escaped!');
  console.log('The timer ran once the ban was lifted');
  timerRan = true;
}
spin();
setTimeout(onTimeout, 50);
process.on('exit', function() {
  assert.ok(ran);
  assert.ok(starved);
  assert.ok(timerRan);
});
