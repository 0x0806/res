'use strict';
const assert = require('assert');
const inspect = require('util').inspect;
const StringDecoder = require('string_decoder').StringDecoder;
let decoder = new StringDecoder();
assert.strictEqual(decoder.encoding, 'utf8');
const decoder2 = {};
StringDecoder.call(decoder2);
assert.strictEqual(decoder2.encoding, 'utf8');
test('utf-8', Buffer.from('$', 'utf-8'), '$');
test('utf-8', Buffer.from('¢', 'utf-8'), '¢');
test('utf-8', Buffer.from('€', 'utf-8'), '€');
test('utf-8', Buffer.from('𤭢', 'utf-8'), '𤭢');
test(
  'utf-8',
  Buffer.from([0xCB, 0xA4, 0x64, 0xE1, 0x8B, 0xA4, 0x30, 0xE3, 0x81, 0x85]),
  '\u02e4\u0064\u12e4\u0030\u3045'
);
test('utf-8', Buffer.from('C9B5A941', 'hex'), '\u0275\ufffdA');
test('utf-8', Buffer.from('E2', 'hex'), '\ufffd');
test('utf-8', Buffer.from('E241', 'hex'), '\ufffdA');
test('utf-8', Buffer.from('CCCCB8', 'hex'), '\ufffd\u0338');
test('utf-8', Buffer.from('F0B841', 'hex'), '\ufffdA');
test('utf-8', Buffer.from('F1CCB8', 'hex'), '\ufffd\u0338');
test('utf-8', Buffer.from('F0FB00', 'hex'), '\ufffd\ufffd\0');
test('utf-8', Buffer.from('CCE2B8B8', 'hex'), '\ufffd\u2e38');
test('utf-8', Buffer.from('E2B8CCB8', 'hex'), '\ufffd\u0338');
test('utf-8', Buffer.from('E2FBCC01', 'hex'), '\ufffd\ufffd\ufffd\u0001');
test('utf-8', Buffer.from('CCB8CDB9', 'hex'), '\u0338\u0379');
test('utf-8', Buffer.from('EDA0B5EDB08D', 'hex'),
     '\ufffd\ufffd\ufffd\ufffd\ufffd\ufffd');
test('ucs2', Buffer.from('ababc', 'ucs2'), 'ababc');
decoder = new StringDecoder('utf8');
assert.strictEqual(decoder.write(Buffer.from('E1', 'hex')), '');
assert(decoder.lastChar.equals(new Uint8Array([0xe1, 0, 0, 0])));
assert.strictEqual(decoder.lastNeed, 2);
assert.strictEqual(decoder.lastTotal, 3);
assert.strictEqual(decoder.end(), '\ufffd');
const arrayBufferViewStr = 'String for ArrayBufferView tests\n';
const inputBuffer = Buffer.from(arrayBufferViewStr.repeat(8), 'utf8');
for (const expectView of common.getArrayBufferViews(inputBuffer)) {
  assert.strictEqual(
    decoder.write(expectView),
    inputBuffer.toString('utf8')
  );
  assert.strictEqual(decoder.end(), '');
}
decoder = new StringDecoder('utf8');
assert.strictEqual(decoder.write(Buffer.from('E18B', 'hex')), '');
assert.strictEqual(decoder.end(), '\ufffd');
decoder = new StringDecoder('utf8');
assert.strictEqual(decoder.write(Buffer.from('\ufffd')), '\ufffd');
assert.strictEqual(decoder.end(), '');
decoder = new StringDecoder('utf8');
assert.strictEqual(decoder.write(Buffer.from('\ufffd\ufffd\ufffd')),
                   '\ufffd\ufffd\ufffd');
assert.strictEqual(decoder.end(), '');
decoder = new StringDecoder('utf8');
assert.strictEqual(decoder.write(Buffer.from('EFBFBDE2', 'hex')), '\ufffd');
assert.strictEqual(decoder.end(), '\ufffd');
decoder = new StringDecoder('utf8');
assert.strictEqual(decoder.write(Buffer.from('F1', 'hex')), '');
assert.strictEqual(decoder.write(Buffer.from('41F2', 'hex')), '\ufffdA');
assert.strictEqual(decoder.end(), '\ufffd');
decoder = new StringDecoder('utf8');
assert.strictEqual(decoder.text(Buffer.from([0x41]), 2), '');
decoder = new StringDecoder('utf16le');
assert.strictEqual(decoder.write(Buffer.from('3DD8', 'hex')), '');
assert.strictEqual(decoder.write(Buffer.from('4D', 'hex')), '');
assert.strictEqual(decoder.write(Buffer.from('DC', 'hex')), '\ud83d\udc4d');
assert.strictEqual(decoder.end(), '');
decoder = new StringDecoder('utf16le');
assert.strictEqual(decoder.write(Buffer.from('3DD8', 'hex')), '');
assert.strictEqual(decoder.end(), '\ud83d');
decoder = new StringDecoder('utf16le');
assert.strictEqual(decoder.write(Buffer.from('3DD8', 'hex')), '');
assert.strictEqual(decoder.write(Buffer.from('4D', 'hex')), '');
assert.strictEqual(decoder.end(), '\ud83d');
decoder = new StringDecoder('utf16le');
assert.strictEqual(decoder.write(Buffer.from('3DD84D', 'hex')), '\ud83d');
assert.strictEqual(decoder.end(), '');
decoder = new StringDecoder('utf16le');
assert.strictEqual(decoder.write(Buffer.alloc(1)), '');
assert.strictEqual(decoder.write(Buffer.alloc(20)), '\0'.repeat(10));
assert.strictEqual(decoder.write(Buffer.alloc(48)), '\0'.repeat(24));
assert.strictEqual(decoder.end(), '');
decoder = new StringDecoder('utf8');
assert.strictEqual(decoder.write(Buffer.from('f69b', 'hex')), '');
assert.strictEqual(decoder.write(Buffer.from('d1', 'hex')), '\ufffd\ufffd');
assert.strictEqual(decoder.end(), '\ufffd');
assert.strictEqual(decoder.write(Buffer.from('f4', 'hex')), '');
assert.strictEqual(decoder.write(Buffer.from('bde5', 'hex')), '\ufffd\ufffd');
assert.strictEqual(decoder.end(), '\ufffd');
assert.throws(
  () => new StringDecoder(1),
  {
    code: 'ERR_UNKNOWN_ENCODING',
    name: 'TypeError',
    message: 'Unknown encoding: 1'
  }
);
assert.throws(
  () => new StringDecoder('test'),
  {
    code: 'ERR_UNKNOWN_ENCODING',
    name: 'TypeError',
    message: 'Unknown encoding: test'
  }
);
assert.throws(
  () => new StringDecoder('utf8').write(null),
  {
    code: 'ERR_INVALID_ARG_TYPE',
    name: 'TypeError',
    message: 'The "buf" argument must be an instance of Buffer, TypedArray,' +
      ' or DataView. Received null'
  }
);
if (common.enoughTestMem) {
  assert.throws(
    () => new StringDecoder().write(Buffer.alloc(0x1fffffe8 + 1).fill('a')),
    {
      code: 'ERR_STRING_TOO_LONG',
    }
  );
}
function test(encoding, input, expected, singleSequence) {
  let sequences;
  if (!singleSequence) {
    sequences = writeSequences(input.length);
  } else {
    sequences = [singleSequence];
  }
  sequences.forEach((sequence) => {
    const decoder = new StringDecoder(encoding);
    let output = '';
    sequence.forEach((write) => {
      output += decoder.write(input.slice(write[0], write[1]));
    });
    output += decoder.end();
    if (output !== expected) {
      const message =
        `Expected "${unicodeEscape(expected)}", ` +
        `but got "${unicodeEscape(output)}"\n` +
        `input: ${input.toString('hex').match(hexNumberRE)}\n` +
        `Write sequence: ${JSON.stringify(sequence)}\n` +
        `Full Decoder State: ${inspect(decoder)}`;
      assert.fail(message);
    }
  });
}
function unicodeEscape(str) {
  let r = '';
  for (let i = 0; i < str.length; i++) {
    r += `\\u${str.charCodeAt(i).toString(16)}`;
  }
  return r;
}
function writeSequences(length, start, sequence) {
  if (start === undefined) {
    start = 0;
    sequence = [];
  } else if (start === length) {
    return [sequence];
  }
  let sequences = [];
  for (let end = length; end > start; end--) {
    const subSequence = sequence.concat([[start, end]]);
    const subSequences = writeSequences(length, end, subSequence, sequences);
    sequences = sequences.concat(subSequences);
  }
  return sequences;
}
