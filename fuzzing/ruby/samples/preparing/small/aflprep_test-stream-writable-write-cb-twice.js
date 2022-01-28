'use strict';
const { Writable } = require('stream');
{
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb();
      cb();
    })
  });
  writable.write('hi');
  writable.on('error', common.expectsError({
    code: 'ERR_MULTIPLE_CALLBACK',
    name: 'Error'
  }));
}
{
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      cb();
      process.nextTick(() => {
        cb();
      });
    })
  });
  writable.write('hi');
  writable.on('error', common.expectsError({
    code: 'ERR_MULTIPLE_CALLBACK',
    name: 'Error'
  }));
}
{
  const writable = new Writable({
    write: common.mustCall((buf, enc, cb) => {
      process.nextTick(cb);
      process.nextTick(() => {
        cb();
      });
    })
  });
  writable.write('hi');
  writable.on('error', common.expectsError({
    code: 'ERR_MULTIPLE_CALLBACK',
    name: 'Error'
  }));
}
