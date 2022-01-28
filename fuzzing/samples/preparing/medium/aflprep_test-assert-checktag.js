'use strict';
const assert = require('assert');
if (process.stdout.isTTY)
  process.env.NODE_DISABLE_COLORS = '1';
{
  const date = new Date('2016');
  function FakeDate() {}
  FakeDate.prototype = Date.prototype;
  const fake = new FakeDate();
  assert.notDeepEqual(date, fake);
  assert.notDeepEqual(fake, date);
  assert.throws(
    () => assert.deepStrictEqual(date, fake),
    {
      message: 'Expected values to be strictly deep-equal:\n' +
               '+ actual - expected\n\n+ 2016-01-01T00:00:00.000Z\n- Date {}'
    }
  );
  assert.throws(
    () => assert.deepStrictEqual(fake, date),
    {
      message: 'Expected values to be strictly deep-equal:\n' +
               '+ actual - expected\n\n+ Date {}\n- 2016-01-01T00:00:00.000Z'
    }
  );
}
  const fakeGlobal = {};
  Object.setPrototypeOf(fakeGlobal, Object.getPrototypeOf(global));
  for (const prop of Object.keys(global)) {
    fakeGlobal[prop] = global[prop];
  }
  assert.notDeepEqual(fakeGlobal, global);
  assert.throws(() => assert.deepStrictEqual(fakeGlobal, global),
                assert.AssertionError);
}
  const fakeProcess = {};
  Object.setPrototypeOf(fakeProcess, Object.getPrototypeOf(process));
  for (const prop of Object.keys(process)) {
    fakeProcess[prop] = process[prop];
  }
  assert.notDeepEqual(fakeProcess, process);
  assert.throws(() => assert.deepStrictEqual(fakeProcess, process),
                assert.AssertionError);
}
