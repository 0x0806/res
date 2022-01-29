'use strict';
const fs = require('fs');
const fork = require('child_process').fork;
const path = require('path');
const assert = require('assert');
tmpdir.refresh();
const warnmod = fixtures.path('warnings.js');
const warnpath = path.join(tmpdir.path, 'warnings.txt');
fork(warnmod, { execArgv: [`--redirect-warnings=${warnpath}`] })
  .on('exit', common.mustCall(() => {
    fs.readFile(warnpath, 'utf8', common.mustSucceed((data) => {
    }));
  }));
