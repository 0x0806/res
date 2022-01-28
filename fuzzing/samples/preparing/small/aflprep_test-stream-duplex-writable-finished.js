'use strict';
const { Duplex } = require('stream');
const assert = require('assert');
{
  assert(Duplex.prototype.hasOwnProperty('writableFinished'));
}
{
  const duplex = new Duplex();
  duplex._write = (chunk, encoding, cb) => {
    assert.strictEqual(duplex.writableFinished, false);
    cb();
  };
  duplex.on('finish', common.mustCall(() => {
    assert.strictEqual(duplex.writableFinished, true);
  }));
  duplex.end('testing finished state', common.mustCall(() => {
    assert.strictEqual(duplex.writableFinished, true);
  }));
}
