'use strict';
const assert = require('assert');
const { Readable: R } = require('stream');
class TestReader extends R {
  constructor(n, opts) {
    super(opts);
    this.pos = 0;
    this.len = n || 100;
  }
  _read(n) {
    setTimeout(() => {
      if (this.pos >= this.len) {
        this.push(null);
        return this.push(null);
      }
      n = Math.min(n, this.len - this.pos);
      if (n <= 0) {
        this.push(null);
        return this.push(null);
      }
      this.pos += n;
      const ret = Buffer.alloc(n, 'a');
      return this.push(ret);
    }, 1);
  }
}
{
  const tr = new TestReader(100);
  tr.setEncoding('utf8');
  const out = [];
  const expect =
    [ 'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa' ];
  tr.on('readable', function flow() {
    let chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });
  tr.on('end', common.mustCall(function() {
    assert.deepStrictEqual(out, expect);
  }));
}
{
  const tr = new TestReader(100);
  tr.setEncoding('hex');
  const out = [];
  const expect =
    [ '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161' ];
  tr.on('readable', function flow() {
    let chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });
  tr.on('end', common.mustCall(function() {
    assert.deepStrictEqual(out, expect);
  }));
}
{
  const tr = new TestReader(100);
  tr.setEncoding('hex');
  const out = [];
  const expect =
    [ '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '16161' ];
  tr.on('readable', function flow() {
    let chunk;
    while (null !== (chunk = tr.read(13)))
      out.push(chunk);
  });
  tr.on('end', common.mustCall(function() {
    assert.deepStrictEqual(out, expect);
  }));
}
{
  const tr = new TestReader(100);
  tr.setEncoding('base64');
  const out = [];
  const expect =
    [ 'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYQ==' ];
  tr.on('readable', function flow() {
    let chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });
  tr.on('end', common.mustCall(function() {
    assert.deepStrictEqual(out, expect);
  }));
}
{
  const tr = new TestReader(100, { encoding: 'utf8' });
  const out = [];
  const expect =
    [ 'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa',
      'aaaaaaaaaa' ];
  tr.on('readable', function flow() {
    let chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });
  tr.on('end', common.mustCall(function() {
    assert.deepStrictEqual(out, expect);
  }));
}
{
  const tr = new TestReader(100, { encoding: 'hex' });
  const out = [];
  const expect =
    [ '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161',
      '6161616161' ];
  tr.on('readable', function flow() {
    let chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });
  tr.on('end', common.mustCall(function() {
    assert.deepStrictEqual(out, expect);
  }));
}
{
  const tr = new TestReader(100, { encoding: 'hex' });
  const out = [];
  const expect =
    [ '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '1616161616161',
      '6161616161616',
      '16161' ];
  tr.on('readable', function flow() {
    let chunk;
    while (null !== (chunk = tr.read(13)))
      out.push(chunk);
  });
  tr.on('end', common.mustCall(function() {
    assert.deepStrictEqual(out, expect);
  }));
}
{
  const tr = new TestReader(100, { encoding: 'base64' });
  const out = [];
  const expect =
    [ 'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYWFhYWFh',
      'YWFhYWFhYW',
      'FhYQ==' ];
  tr.on('readable', function flow() {
    let chunk;
    while (null !== (chunk = tr.read(10)))
      out.push(chunk);
  });
  tr.on('end', common.mustCall(function() {
    assert.deepStrictEqual(out, expect);
  }));
}
{
  const tr = new TestReader(100);
  assert.deepStrictEqual(tr.setEncoding('utf8'), tr);
}
