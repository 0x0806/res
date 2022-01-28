'use strict';
const fs = require('fs');
const listener = common.mustNotCall(
  'listener should have been removed before the event was emitted'
);
const watch = fs.watchFile(__filename, common.mustNotCall());
watch.once('stop', listener);
watch.stop();
watch.removeListener('stop', listener);
