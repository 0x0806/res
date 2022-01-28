'use strict';
const assert = require('assert');
const fromList = require('stream').Readable._fromList;
const util = require('util');
function bufferListFromArray(arr) {
  const bl = new BufferList();
  for (let i = 0; i < arr.length; ++i)
    bl.push(arr[i]);
  return bl;
}
{
  let list = [ Buffer.from('foog'),
               Buffer.from('bark'),
               Buffer.from('bazy'),
               Buffer.from('kuel') ];
  list = bufferListFromArray(list);
  assert.strictEqual(
    util.inspect([ list ], { compact: false }),
    `[
  BufferList {
    head: [Object],
    tail: [Object],
    length: 4
  }
]`);
  let ret = fromList(6, { buffer: list, length: 16 });
  assert.strictEqual(ret.toString(), 'foogba');
  ret = fromList(2, { buffer: list, length: 10 });
  assert.strictEqual(ret.toString(), 'rk');
  ret = fromList(2, { buffer: list, length: 8 });
  assert.strictEqual(ret.toString(), 'ba');
  ret = fromList(100, { buffer: list, length: 6 });
  assert.strictEqual(ret.toString(), 'zykuel');
  assert.deepStrictEqual(list, new BufferList());
}
{
  let list = [ 'foog',
               'bark',
               'bazy',
               'kuel' ];
  list = bufferListFromArray(list);
  let ret = fromList(6, { buffer: list, length: 16, decoder: true });
  assert.strictEqual(ret, 'foogba');
  ret = fromList(2, { buffer: list, length: 10, decoder: true });
  assert.strictEqual(ret, 'rk');
  ret = fromList(2, { buffer: list, length: 8, decoder: true });
  assert.strictEqual(ret, 'ba');
  ret = fromList(100, { buffer: list, length: 6, decoder: true });
  assert.strictEqual(ret, 'zykuel');
  assert.deepStrictEqual(list, new BufferList());
}
