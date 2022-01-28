'use strict';
const assert = require('assert');
const inspect = require('util').inspect;
const { _checkIsHttpToken, _checkInvalidHeaderChar } = require('_http_common');
[
  'TCN',
  'ETag',
  'date',
  'alt-svc',
  'Content-Type',
  '0',
  'Set-Cookie2',
  'Set_Cookie',
  'foo`bar^',
  'foo|bar',
  '~foobar',
  'FooBar!',
  '#Foo',
  '$et-Cookie',
  '%%Test%%',
  'Test&123',
  'It\'s_fun',
  '2*3',
  '4+2',
  '3.14159265359',
].forEach(function(str) {
  assert.strictEqual(
    _checkIsHttpToken(str), true,
    `_checkIsHttpToken(${inspect(str)}) unexpectedly failed`);
});
[
  ':',
  '@@',
  '((((())))',
  ':alternate-protocol',
  'alternate-protocol:',
  'foo\nbar',
  'foo\rbar',
  'foo\r\nbar',
  'foo\x00bar',
  '\x7FMe!',
  '{Start',
  '(Start',
  '[Start',
  'End}',
  'End)',
  'End]',
  '"Quote"',
  'This,That',
].forEach(function(str) {
  assert.strictEqual(
    _checkIsHttpToken(str), false,
    `_checkIsHttpToken(${inspect(str)}) unexpectedly succeeded`);
});
[
  'foo bar',
  'foo\tbar',
  '0123456789ABCdef',
].forEach(function(str) {
  assert.strictEqual(
    _checkInvalidHeaderChar(str), false,
    `_checkInvalidHeaderChar(${inspect(str)}) unexpectedly failed`);
});
[
  'foo\rbar',
  'foo\nbar',
  'foo\r\nbar',
  '\x7FMe!',
  'Testing 123\x00',
  'foo\vbar',
  'Ding!\x07',
].forEach(function(str) {
  assert.strictEqual(
    _checkInvalidHeaderChar(str), true,
    `_checkInvalidHeaderChar(${inspect(str)}) unexpectedly succeeded`);
});
