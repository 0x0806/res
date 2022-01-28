'use strict';
const assert = require('assert');
{
  const starttime = Date.now();
  setTimeout(common.mustCall(function() {
    const endtime = Date.now();
    const diff = endtime - starttime;
    assert.ok(diff > 0);
    console.error(`diff: ${diff}`);
    assert.ok(1000 <= diff && diff < 1000 + WINDOW);
  }), 1000);
}
{
  const id = setTimeout(common.mustNotCall(), 500);
  clearTimeout(id);
}
{
  const starttime = Date.now();
  let interval_count = 0;
  setInterval(common.mustCall(function() {
    interval_count += 1;
    const endtime = Date.now();
    const diff = endtime - starttime;
    assert.ok(diff > 0);
    console.error(`diff: ${diff}`);
    const t = interval_count * 1000;
    assert.ok(t <= diff && diff < t + (WINDOW * interval_count));
    assert.ok(interval_count <= 3, `interval_count: ${interval_count}`);
    if (interval_count === 3)
      clearInterval(this);
  }, 3), 1000);
}
{
  setTimeout(function(param) {
    assert.strictEqual(param, 'test param');
  }, 1000, 'test param');
}
{
  let interval_count = 0;
  setInterval(function(param) {
    ++interval_count;
    assert.strictEqual(param, 'test param');
    if (interval_count === 3)
      clearInterval(this);
  }, 1000, 'test param');
}
{
  setTimeout(function(param1, param2) {
    assert.strictEqual(param1, 'param1');
    assert.strictEqual(param2, 'param2');
  }, 1000, 'param1', 'param2');
}
{
  let interval_count = 0;
  setInterval(function(param1, param2) {
    ++interval_count;
    assert.strictEqual(param1, 'param1');
    assert.strictEqual(param2, 'param2');
    if (interval_count === 3)
      clearInterval(this);
  }, 1000, 'param1', 'param2');
}
{
  let count = 0;
  const interval = setInterval(common.mustCall(function() {
    if (++count > 10) clearInterval(interval);
  }, 11), 0);
}
{
  const t = common.mustCall(3);
  setTimeout(t, 200);
  setTimeout(t, 200);
  const y = setTimeout(t, 200);
  clearTimeout(y);
  setTimeout(t, 200);
  clearTimeout(y);
}
