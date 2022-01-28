'use strict';
const interval = setInterval(common.mustNotCall(), 1);
clearTimeout(interval);
const timeout = setTimeout(common.mustNotCall(), 1);
clearInterval(timeout);
