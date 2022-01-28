'use strict';
const fs = require('fs');
const fork = require('child_process').fork;
const path = require('path');
const assert = require('assert');
tmpdir.refresh();
const warnmod = require.resolve(fixtures.path('warnings.js'));
const warnpath = path.join(tmpdir.path, 'warnings.txt');
fork(warnmod, { env: { ...process.env, NODE_REDIRECT_WARNINGS: warnpath } })
  .on('exit', common.mustCall(() => {
    fs.readFile(warnpath, 'utf8', common.mustSucceed((data) => {
    }));
  }));
