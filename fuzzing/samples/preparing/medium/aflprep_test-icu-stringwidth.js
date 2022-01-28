'use strict';
const assert = require('assert');
assert.strictEqual(getStringWidth('a'), 1);
assert.strictEqual(getStringWidth(String.fromCharCode(0x0061)), 1);
assert.strictEqual(getStringWidth('丁'), 2);
assert.strictEqual(getStringWidth(String.fromCharCode(0x4E01)), 2);
assert.strictEqual(getStringWidth('\ud83d\udc78\ud83c\udfff'), 4);
assert.strictEqual(getStringWidth('👅'), 2);
assert.strictEqual(getStringWidth('\ud83d'), 1);
assert.strictEqual(getStringWidth('\udc78'), 1);
assert.strictEqual(getStringWidth('\u0000'), 0);
assert.strictEqual(getStringWidth(String.fromCharCode(0x0007)), 0);
assert.strictEqual(getStringWidth('\n'), 0);
assert.strictEqual(getStringWidth(String.fromCharCode(0x00AD)), 1);
assert.strictEqual(getStringWidth('\u200Ef\u200F'), 1);
assert.strictEqual(getStringWidth(String.fromCharCode(0x10FFEF)), 1);
assert.strictEqual(getStringWidth(String.fromCharCode(0x3FFEF)), 1);
assert.strictEqual(getStringWidth(String.fromCharCode(0x0301)), 0);
assert.strictEqual(getStringWidth(String.fromCharCode(0x1B44)), 1);
assert.strictEqual(getStringWidth(String.fromCharCode(0x20DD)), 0);
assert.strictEqual(getStringWidth('👩‍👩‍👧‍👧'), 8);
assert.strictEqual(getStringWidth('❤️'), 1);
assert.strictEqual(getStringWidth('👩‍❤️‍👩'), 5);
assert.strictEqual(getStringWidth('❤'), 1);
assert.strictEqual(getStringWidth('\u01d4'), 1);
assert.strictEqual(getStringWidth('\u200E\n\u220A\u20D2'), 1);
for (let i = 0; i < 256; i++) {
  const char = String.fromCharCode(i);
  assert.strictEqual(
    getStringWidth(char + '🎉'),
    getStringWidth(char) + 2);
    assert.strictEqual(getStringWidth(char), 0);
    assert.strictEqual(getStringWidth(char), 1);
  }
}
if (common.hasIntl) {
  assert.strictEqual(a.length, 6);
  assert.strictEqual(b.length, 2);
  assert.strictEqual(getStringWidth(a), 4);
  assert.strictEqual(getStringWidth(b), 4);
}
