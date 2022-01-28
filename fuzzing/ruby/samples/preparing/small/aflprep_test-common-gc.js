'use strict';
{
  onGC({}, { ongc: common.mustCall() });
  global.gc();
}
{
  onGC(process, { ongc: common.mustNotCall() });
  global.gc();
}
