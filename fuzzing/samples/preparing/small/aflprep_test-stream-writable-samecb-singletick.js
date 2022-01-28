'use strict';
const { Console } = require('console');
const { Writable } = require('stream');
const async_hooks = require('async_hooks');
const checkTickCreated = common.mustCall();
async_hooks.createHook({
  init(id, type, triggerId, resoure) {
    if (type === 'TickObject') checkTickCreated();
  }
}).enable();
const console = new Console(new Writable({
  write: common.mustCall((chunk, encoding, cb) => {
    cb();
  }, 100)
}));
for (let i = 0; i < 100; i++)
  console.log(i);
