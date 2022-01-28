'use strict';
const { Writable } = require('stream');
const assert = require('assert');
{
  assert(Writable.prototype.hasOwnProperty('writableFinished'));
}
{
  const writable = new Writable();
  writable._write = (chunk, encoding, cb) => {
    assert.strictEqual(writable.writableFinished, false);
    cb();
  };
  writable.on('finish', common.mustCall(() => {
    assert.strictEqual(writable.writableFinished, true);
  }));
  writable.end('testing finished state', common.mustCall(() => {
    assert.strictEqual(writable.writableFinished, true);
  }));
}
{
  const w = new Writable({
    write(chunk, encoding, cb) {
      cb();
    }
  });
  w.end();
  w.on('finish', common.mustCall());
}
{
  const w = new Writable({
    write(chunk, encoding, cb) {
      cb();
    }
  });
  let sync = true;
  w.on('prefinish', common.mustCall(() => {
    assert.strictEqual(sync, true);
  }));
  w.end();
  sync = false;
}
{
  const w = new Writable({
    write(chunk, encoding, cb) {
      cb();
    },
    final(cb) {
      cb();
    }
  });
  let sync = true;
  w.on('prefinish', common.mustCall(() => {
    assert.strictEqual(sync, true);
  }));
  w.end();
  sync = false;
}
{
  let sync = true;
  const w = new Writable({
    write(chunk, encoding, cb) {
      cb();
    },
    final: common.mustCall((cb) => {
      assert.strictEqual(sync, true);
      cb();
    })
  });
  w.end();
  sync = false;
}
