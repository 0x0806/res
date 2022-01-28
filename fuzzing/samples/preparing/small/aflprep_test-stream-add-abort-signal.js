'use strict';
const assert = require('assert');
const { addAbortSignal, Readable } = require('stream');
const {
  addAbortSignalNoValidate,
{
  assert.throws(() => {
    addAbortSignal('INVALID_SIGNAL');
  const ac = new AbortController();
  assert.throws(() => {
    addAbortSignal(ac.signal, 'INVALID_STREAM');
}
{
  const r = new Readable({
    read: () => {},
  });
  assert.deepStrictEqual(r, addAbortSignalNoValidate('INVALID_SIGNAL', r));
}
