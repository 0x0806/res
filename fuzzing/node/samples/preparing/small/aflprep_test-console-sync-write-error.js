'use strict';
const { Console } = require('console');
const { Writable } = require('stream');
for (const method of ['dir', 'log', 'warn']) {
  {
    const out = new Writable({
      write: common.mustCall((chunk, enc, callback) => {
        callback(new Error('foobar'));
      })
    });
    const c = new Console(out, out, true);
  }
  {
    const out = new Writable({
      write: common.mustCall((chunk, enc, callback) => {
        throw new Error('foobar');
      })
    });
    const c = new Console(out, out, true);
  }
  {
    const out = new Writable({
      write: common.mustCall((chunk, enc, callback) => {
        setImmediate(() => callback(new Error('foobar')));
      })
    });
    const c = new Console(out, out, true);
  }
}
