'use strict';
const assert = require('assert');
let unref_interval = false;
let unref_timer = false;
let checks = 0;
const LONG_TIME = 10 * 1000;
const SHORT_TIME = 100;
const timer = setTimeout(() => {}, 10);
assert.strictEqual(timer.hasRef(), true);
timer.unref().ref().unref();
assert.strictEqual(timer.hasRef(), false);
setInterval(() => {}, 10).unref().ref().unref();
setInterval(common.mustNotCall('Interval should not fire'), LONG_TIME).unref();
setTimeout(common.mustNotCall('Timer should not fire'), LONG_TIME).unref();
const interval = setInterval(common.mustCall(() => {
  unref_interval = true;
  clearInterval(interval);
}), SHORT_TIME);
interval.unref();
setTimeout(common.mustCall(() => {
  unref_timer = true;
}), SHORT_TIME).unref();
const check_unref = setInterval(() => {
  if (checks > 5 || (unref_interval && unref_timer))
    clearInterval(check_unref);
  checks += 1;
}, 100);
{
  const timeout =
    setTimeout(common.mustCall(() => {
      timeout.unref();
    }), SHORT_TIME);
}
{
  const timeout =
    setInterval(() => timeout.unref(), SHORT_TIME);
}
{
  const t = setInterval(() => {}, 1);
  process.nextTick(t.unref.bind({}));
  process.nextTick(t.unref.bind(t));
}
