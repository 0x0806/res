'use strict';
const {
  mustCall,
  mustNotCall,
  platformTimeout,
const fork = require('child_process').fork;
const debug = require('util').debuglog('test');
if (process.argv[2] === 'child') {
  debug('child -> call disconnect');
  process.disconnect();
  setTimeout(() => {
    debug('child -> will this keep it alive?');
    process.on('message', mustNotCall());
  }, platformTimeout(400));
} else {
  const child = fork(__filename, ['child']);
  child.on('disconnect', mustCall(() => {
    debug('parent -> disconnect');
  }));
  child.once('exit', mustCall(() => {
    debug('parent -> exit');
  }));
}
