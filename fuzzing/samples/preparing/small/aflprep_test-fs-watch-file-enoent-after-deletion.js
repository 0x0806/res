'use strict';
const path = require('path');
const fs = require('fs');
tmpdir.refresh();
const filename = path.join(tmpdir.path, 'watched');
fs.writeFileSync(filename, 'quis custodiet ipsos custodes');
fs.watchFile(filename, { interval: 50 }, common.mustCall(function(curr, prev) {
  fs.unwatchFile(filename);
}));
fs.unlinkSync(filename);
