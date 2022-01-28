'use strict';
const timers = require('timers');
{
  const interval = setInterval(common.mustCall(() => {
    clearTimeout(interval);
  }), 1).unref();
}
{
  const interval = setInterval(common.mustCall(() => {
    interval.close();
  }), 1).unref();
}
{
  const interval = setInterval(common.mustCall(() => {
    timers.unenroll(interval);
  }), 1).unref();
}
{
  const interval = setInterval(common.mustCall(() => {
    interval._idleTimeout = -1;
  }), 1).unref();
}
{
  const interval = setInterval(common.mustCall(() => {
    interval._onTimeout = null;
  }), 1).unref();
}
setTimeout(common.mustCall(() => {
  setTimeout(common.mustCall(), 1);
}), 1);
