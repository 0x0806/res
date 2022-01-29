'use strict';
const assert = require('assert');
const child_process = require('child_process');
const path = require('path');
process.env.NODE_DEBUG = 'http';
const { stderr } = child_process.spawnSync(process.execPath, [
  path.resolve(__dirname, 'test-http-conn-reset.js'),
], { encoding: 'utf8' });
       stderr);
