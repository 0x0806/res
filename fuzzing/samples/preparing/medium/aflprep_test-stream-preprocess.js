'use strict';
const assert = require('assert');
const fs = require('fs');
const rl = require('readline');
const BOM = '\uFEFF';
const modelData = fixtures.readSync('file-to-read-without-bom.txt', 'utf8');
const modelDataFirstCharacter = modelData[0];
assert.strictEqual(fixtures.readSync('file-to-read-with-bom.txt', 'utf8'),
                   `${BOM}${modelData}`
);
const inputWithoutBOM =
  fs.createReadStream(fixtures.path('file-to-read-without-bom.txt'), 'utf8');
inputWithoutBOM.once('readable', common.mustCall(() => {
  const maybeBOM = inputWithoutBOM.read(1);
  assert.strictEqual(maybeBOM, modelDataFirstCharacter);
  assert.notStrictEqual(maybeBOM, BOM);
  inputWithoutBOM.unshift(maybeBOM);
  let streamedData = '';
  rl.createInterface({
    input: inputWithoutBOM,
  }).on('line', common.mustCall((line) => {
    streamedData += `${line}\n`;
  }, lineCount)).on('close', common.mustCall(() => {
    assert.strictEqual(streamedData, modelData);
  }));
}));
const inputWithBOM =
  fs.createReadStream(fixtures.path('file-to-read-with-bom.txt'), 'utf8');
inputWithBOM.once('readable', common.mustCall(() => {
  const maybeBOM = inputWithBOM.read(1);
  assert.strictEqual(maybeBOM, BOM);
  let streamedData = '';
  rl.createInterface({
    input: inputWithBOM,
  }).on('line', common.mustCall((line) => {
    streamedData += `${line}\n`;
  }, lineCount)).on('close', common.mustCall(() => {
    assert.strictEqual(streamedData, modelData);
  }));
}));
