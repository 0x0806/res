'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const {
  randomUUID,
} = require('crypto');
const last = new Set([
  '00000000-0000-0000-0000-000000000000',
]);
function testMatch(uuid) {
  assert.match(
    uuid,
}
for (let n = 0; n < 130; n++) {
  const uuid = randomUUID();
  assert(!last.has(uuid));
  last.add(uuid);
  assert.strictEqual(typeof uuid, 'string');
  assert.strictEqual(uuid.length, 36);
  testMatch(uuid);
  assert.strictEqual(
    Buffer.from(uuid.substr(14, 2), 'hex')[0] & 0x40, 0x40);
  assert.strictEqual(
    Buffer.from(uuid.substr(19, 2), 'hex')[0] & 0b1100_0000, 0b1000_0000);
}
{
  testMatch(randomUUID({ disableEntropyCache: true }));
  testMatch(randomUUID({ disableEntropyCache: true }));
  testMatch(randomUUID({ disableEntropyCache: true }));
  testMatch(randomUUID({ disableEntropyCache: true }));
  assert.throws(() => randomUUID(1), {
    code: 'ERR_INVALID_ARG_TYPE'
  });
  assert.throws(() => randomUUID({ disableEntropyCache: '' }), {
    code: 'ERR_INVALID_ARG_TYPE'
  });
}
