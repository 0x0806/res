'use strict';
const assert = require('assert');
const { Readable } = require('stream');
const readline = require('readline');
const CONTENT = 'content';
const TOTAL_LINES = 18;
(async () => {
  const readable = new Readable({ read() {} });
  readable.push(`${CONTENT}\n`.repeat(TOTAL_LINES));
  const rli = readline.createInterface({
    input: readable,
    crlfDelay: Infinity
  });
  const it = rli[Symbol.asyncIterator]();
  const highWaterMark = it.stream.readableHighWaterMark;
  assert(TOTAL_LINES > highWaterMark);
  let iterations = 0;
  let readableEnded = false;
  for await (const line of it) {
    assert.strictEqual(readableEnded, false);
    assert.strictEqual(line, CONTENT);
    const expectedPaused = TOTAL_LINES - iterations > highWaterMark;
    assert.strictEqual(readable.isPaused(), expectedPaused);
    iterations += 1;
    if (iterations === TOTAL_LINES) {
      readable.push(null);
      readableEnded = true;
    }
  }
  assert.strictEqual(iterations, TOTAL_LINES);
})().then(common.mustCall());
