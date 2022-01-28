'use strict';
const assert = require('assert');
[
  setTimeout(common.mustNotCall(), 1),
  setInterval(common.mustNotCall(), 1),
].forEach((timeout) => {
  assert.strictEqual(Number.isNaN(+timeout), false);
  assert.strictEqual(+timeout, timeout[Symbol.toPrimitive]());
  assert.strictEqual(`${timeout}`, timeout[Symbol.toPrimitive]().toString());
  assert.deepStrictEqual(Object.keys({ [timeout]: timeout }), [`${timeout}`]);
  clearTimeout(+timeout);
});
{
  const timeout = setTimeout(common.mustNotCall(), 1);
  const id = +timeout;
  clearTimeout(id);
}
{
  const timeout = setTimeout(common.mustNotCall(), 1);
  const id = `${timeout}`;
  clearTimeout(id);
}
