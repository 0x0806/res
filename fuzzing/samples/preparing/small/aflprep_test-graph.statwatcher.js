'use strict';
const fs = require('fs');
const hooks = initHooks();
hooks.enable();
function onchange() { }
fs.watchFile(__filename, onchange);
fs.watchFile(commonPath, onchange);
fs.unwatchFile(__filename);
fs.unwatchFile(commonPath);
process.on('exit', onexit);
function onexit() {
  hooks.disable();
  verifyGraph(
    hooks,
    [ { type: 'STATWATCHER', id: 'statwatcher:1', triggerAsyncId: null },
      { type: 'STATWATCHER', id: 'statwatcher:2', triggerAsyncId: null } ]
  );
}
