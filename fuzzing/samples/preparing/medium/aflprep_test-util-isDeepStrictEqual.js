'use strict';
const assert = require('assert');
const util = require('util');
class MyDate extends Date {
  constructor(...args) {
    super(...args);
    this[0] = '1';
  }
}
class MyRegExp extends RegExp {
  constructor(...args) {
    super(...args);
    this[0] = '1';
  }
}
{
  const arr = new Uint8Array([120, 121, 122, 10]);
  const buf = Buffer.from(arr);
  assert.strictEqual(util.isDeepStrictEqual(arr, buf), false);
  const buf2 = Buffer.from(arr);
  buf2.prop = 1;
  assert.strictEqual(util.isDeepStrictEqual(buf2, buf), false);
  const arr2 = new Uint8Array([120, 121, 122, 10]);
  arr2.prop = 5;
  assert.strictEqual(util.isDeepStrictEqual(arr, arr2), false);
}
{
  const date = new Date('2016');
  const date2 = new MyDate('2016');
  assert.strictEqual(util.isDeepStrictEqual(date, date2), false);
  assert.strictEqual(util.isDeepStrictEqual(date2, date), false);
}
{
  const re1 = new RegExp('test');
  const re2 = new MyRegExp('test');
  assert.strictEqual(util.isDeepStrictEqual(re1, re2), false);
}
{
  const similar = new Set([
  ]);
  for (const a of similar) {
    for (const b of similar) {
      if (a !== b) {
        assert.strictEqual(util.isDeepStrictEqual(a, b), false);
      }
    }
  }
}
function utilIsDeepStrict(a, b) {
  assert.strictEqual(util.isDeepStrictEqual(a, b), true);
  assert.strictEqual(util.isDeepStrictEqual(b, a), true);
}
function notUtilIsDeepStrict(a, b) {
  assert.strictEqual(util.isDeepStrictEqual(a, b), false);
  assert.strictEqual(util.isDeepStrictEqual(b, a), false);
}
utilIsDeepStrict(new Set(), new Set());
utilIsDeepStrict(new Map(), new Map());
utilIsDeepStrict(new Set([1, 2, 3]), new Set([1, 2, 3]));
notUtilIsDeepStrict(new Set([1, 2, 3]), new Set([1, 2, 3, 4]));
notUtilIsDeepStrict(new Set([1, 2, 3, 4]), new Set([1, 2, 3]));
utilIsDeepStrict(new Set(['1', '2', '3']), new Set(['1', '2', '3']));
utilIsDeepStrict(new Set([[1, 2], [3, 4]]), new Set([[3, 4], [1, 2]]));
{
  const a = [ 1, 2 ];
  const b = [ 3, 4 ];
  const c = [ 1, 2 ];
  const d = [ 3, 4 ];
  utilIsDeepStrict(
    { a: a, b: b, s: new Set([a, b]) },
    { a: c, b: d, s: new Set([d, c]) }
  );
}
utilIsDeepStrict(new Map([[1, 1], [2, 2]]), new Map([[1, 1], [2, 2]]));
utilIsDeepStrict(new Map([[1, 1], [2, 2]]), new Map([[2, 2], [1, 1]]));
notUtilIsDeepStrict(new Map([[1, 1], [2, 2]]), new Map([[1, 2], [2, 1]]));
notUtilIsDeepStrict(
  new Map([[[1], 1], [{}, 2]]),
  new Map([[[1], 2], [{}, 1]])
);
notUtilIsDeepStrict(new Set([1]), [1]);
notUtilIsDeepStrict(new Set(), []);
notUtilIsDeepStrict(new Set(), {});
notUtilIsDeepStrict(new Map([['a', 1]]), { a: 1 });
notUtilIsDeepStrict(new Map(), []);
notUtilIsDeepStrict(new Map(), {});
notUtilIsDeepStrict(new Set(['1']), new Set([1]));
notUtilIsDeepStrict(new Map([['1', 'a']]), new Map([[1, 'a']]));
notUtilIsDeepStrict(new Map([['a', '1']]), new Map([['a', 1]]));
notUtilIsDeepStrict(new Map([['a', '1']]), new Map([['a', 2]]));
utilIsDeepStrict(new Set([{}]), new Set([{}]));
notUtilIsDeepStrict(
  new Set([{ a: 1 }, { a: 1 }]),
  new Set([{ a: 1 }, { a: 2 }])
);
notUtilIsDeepStrict(
  new Set([{ a: 1 }, { a: 1 }, { a: 2 }]),
  new Set([{ a: 1 }, { a: 2 }, { a: 2 }])
);
notUtilIsDeepStrict(
  new Map([[{ x: 1 }, 5], [{ x: 1 }, 5]]),
  new Map([[{ x: 1 }, 5], [{ x: 2 }, 5]])
);
notUtilIsDeepStrict(new Set([3, '3']), new Set([3, 4]));
notUtilIsDeepStrict(new Map([[3, 0], ['3', 0]]), new Map([[3, 0], [4, 0]]));
notUtilIsDeepStrict(
  new Set([{ a: 1 }, { a: 1 }, { a: 2 }]),
  new Set([{ a: 1 }, { a: 2 }, { a: 2 }])
);
utilIsDeepStrict(
  new Map([[1, 'a'], [{}, 'a']]),
  new Map([[1, 'a'], [{}, 'a']])
);
utilIsDeepStrict(
  new Set([1, 'a', [{}, 'a']]),
  new Set([1, 'a', [{}, 'a']])
);
notUtilIsDeepStrict(
  new Map([[1, 'a'], ['1', 'b']]),
  new Map([['1', 'a'], [true, 'b']])
);
notUtilIsDeepStrict(
  new Set(['a']),
  new Set(['b'])
);
utilIsDeepStrict(
  new Map([[{}, 'a'], [{}, 'b']]),
  new Map([[{}, 'b'], [{}, 'a']])
);
notUtilIsDeepStrict(
  new Map([[true, 'a'], ['1', 'b'], [1, 'a']]),
  new Map([['1', 'a'], [1, 'b'], [true, 'a']])
);
notUtilIsDeepStrict(
  new Map([[true, 'a'], ['1', 'b'], [1, 'c']]),
  new Map([['1', 'a'], [1, 'b'], [true, 'a']])
);
notUtilIsDeepStrict(
  new Set([{}, {}]),
  new Set([{}, 1])
);
notUtilIsDeepStrict(
  new Set([[{}, 1], [{}, 1]]),
  new Set([[{}, 1], [1, 1]])
);
notUtilIsDeepStrict(
  new Map([[{}, 1], [{}, 1]]),
  new Map([[{}, 1], [1, 1]])
);
notUtilIsDeepStrict(
  new Map([[{}, 1], [true, 1]]),
  new Map([[{}, 1], [1, 1]])
);
notUtilIsDeepStrict(
  new Set([1, true, false]),
  new Set(['1', 0, '0'])
);
notUtilIsDeepStrict(
  new Map([[1, 5], [true, 5], [false, 5]]),
  new Map([['1', 5], [0, 5], ['0', 5]])
);
utilIsDeepStrict(
  new Map([[1, undefined]]),
  new Map([[1, undefined]])
);
notUtilIsDeepStrict(
  new Map([[1, null]]),
  new Map([['1', undefined]])
);
notUtilIsDeepStrict(
  new Map([[1, undefined]]),
  new Map([[2, undefined]])
);
utilIsDeepStrict(
  new Map([[null, 3]]),
  new Map([[null, 3]])
);
notUtilIsDeepStrict(
  new Map([[null, undefined]]),
  new Map([[undefined, null]])
);
notUtilIsDeepStrict(
  new Set([null]),
  new Set([undefined])
);
{
  const b = {};
  b.b = b;
  const c = {};
  c.b = c;
  utilIsDeepStrict(b, c);
  const d = {};
  d.a = 1;
  d.b = d;
  const e = {};
  e.a = 1;
  e.b = {};
  notUtilIsDeepStrict(d, e);
}
{
  const a = {};
  const b = {};
  a.a = a;
  b.a = {};
  b.a.a = a;
  utilIsDeepStrict(a, b);
}
{
  const a = new Set();
  const b = new Set();
  const c = new Set();
  a.add(a);
  b.add(b);
  c.add(a);
  utilIsDeepStrict(b, c);
}
{
  const args = (function() { return arguments; })();
  notUtilIsDeepStrict([], args);
}
{
  const returnArguments = function() { return arguments; };
  const someArgs = returnArguments('a');
  const sameArgs = returnArguments('a');
  const diffArgs = returnArguments('b');
  notUtilIsDeepStrict(someArgs, ['a']);
  notUtilIsDeepStrict(someArgs, { '0': 'a' });
  notUtilIsDeepStrict(someArgs, diffArgs);
  utilIsDeepStrict(someArgs, sameArgs);
}
{
  const values = [
    123,
    Infinity,
    0,
    null,
    undefined,
    false,
    true,
    {},
    [],
    () => {},
  ];
  utilIsDeepStrict(new Set(values), new Set(values));
  utilIsDeepStrict(new Set(values), new Set(values.reverse()));
  const mapValues = values.map((v) => [v, { a: 5 }]);
  utilIsDeepStrict(new Map(mapValues), new Map(mapValues));
  utilIsDeepStrict(new Map(mapValues), new Map(mapValues.reverse()));
}
{
  const s1 = new Set();
  const s2 = new Set();
  s1.add(1);
  s1.add(2);
  s2.add(2);
  s2.add(1);
  utilIsDeepStrict(s1, s2);
}
{
  const m1 = new Map();
  const m2 = new Map();
  const obj = { a: 5, b: 6 };
  m1.set(1, obj);
  m1.set(2, 'hi');
  m1.set(3, [1, 2, 3]);
  m2.set(1, obj);
  utilIsDeepStrict(m1, m2);
}
{
  const m1 = new Map();
  const m2 = new Map();
  m1.set(1, m1);
  m2.set(1, new Map());
  notUtilIsDeepStrict(m1, m2);
}
{
  const map1 = new Map([[1, 1]]);
  const map2 = new Map([[1, '1']]);
  assert.strictEqual(util.isDeepStrictEqual(map1, map2), false);
}
{
  const s1 = new Set();
  const s2 = new Set();
  s1.x = 5;
  notUtilIsDeepStrict(s1, s2);
  const m1 = new Map();
  const m2 = new Map();
  m1.x = 5;
  notUtilIsDeepStrict(m1, m2);
}
{
  const s1 = new Set();
  s1.add(s1);
  const s2 = new Set();
  s2.add(s2);
  utilIsDeepStrict(s1, s2);
  const m1 = new Map();
  m1.set(2, m1);
  const m2 = new Map();
  m2.set(2, m2);
  utilIsDeepStrict(m1, m2);
  const m3 = new Map();
  m3.set(m3, 2);
  const m4 = new Map();
  m4.set(m4, 2);
  utilIsDeepStrict(m3, m4);
}
utilIsDeepStrict([1, , , 3], [1, , , 3]);
notUtilIsDeepStrict([1, , , 3], [1, , , 3, , , ]);
{
  const err1 = new Error('foo1');
  const err2 = new Error('foo2');
  const err3 = new TypeError('foo1');
  notUtilIsDeepStrict(err1, err2, assert.AssertionError);
  notUtilIsDeepStrict(err1, err3, assert.AssertionError);
  notUtilIsDeepStrict(err1, {}, assert.AssertionError);
}
assert.strictEqual(util.isDeepStrictEqual(NaN, NaN), true);
assert.strictEqual(util.isDeepStrictEqual({ a: NaN }, { a: NaN }), true);
assert.strictEqual(
  util.isDeepStrictEqual([ 1, 2, NaN, 4 ], [ 1, 2, NaN, 4 ]),
  true
);
{
  const boxedString = new String('test');
  const boxedSymbol = Object(Symbol());
  notUtilIsDeepStrict(new Boolean(true), Object(false));
  notUtilIsDeepStrict(Object(true), new Number(1));
  notUtilIsDeepStrict(new Number(2), new Number(1));
  notUtilIsDeepStrict(boxedSymbol, Object(Symbol()));
  notUtilIsDeepStrict(boxedSymbol, {});
  utilIsDeepStrict(boxedSymbol, boxedSymbol);
  utilIsDeepStrict(Object(true), Object(true));
  utilIsDeepStrict(Object(2), Object(2));
  utilIsDeepStrict(boxedString, Object('test'));
  boxedString.slow = true;
  notUtilIsDeepStrict(boxedString, Object('test'));
  boxedSymbol.slow = true;
  notUtilIsDeepStrict(boxedSymbol, {});
  utilIsDeepStrict(Object(BigInt(1)), Object(BigInt(1)));
  notUtilIsDeepStrict(Object(BigInt(1)), Object(BigInt(2)));
  const booleanish = new Boolean(true);
  Object.defineProperty(booleanish, Symbol.toStringTag, { value: 'String' });
  Object.setPrototypeOf(booleanish, String.prototype);
  notUtilIsDeepStrict(booleanish, new String('true'));
  const numberish = new Number(42);
  Object.defineProperty(numberish, Symbol.toStringTag, { value: 'String' });
  Object.setPrototypeOf(numberish, String.prototype);
  notUtilIsDeepStrict(numberish, new String('42'));
  const stringish = new String('0');
  Object.defineProperty(stringish, Symbol.toStringTag, { value: 'Number' });
  Object.setPrototypeOf(stringish, Number.prototype);
  notUtilIsDeepStrict(stringish, new Number(0));
  const bigintish = new Object(BigInt(42));
  Object.defineProperty(bigintish, Symbol.toStringTag, { value: 'String' });
  Object.setPrototypeOf(bigintish, String.prototype);
  notUtilIsDeepStrict(bigintish, new String('42'));
  const symbolish = new Object(Symbol('fhqwhgads'));
  Object.defineProperty(symbolish, Symbol.toStringTag, { value: 'String' });
  Object.setPrototypeOf(symbolish, String.prototype);
  notUtilIsDeepStrict(symbolish, new String('fhqwhgads'));
}
notUtilIsDeepStrict(0, -0);
utilIsDeepStrict(-0, -0);
{
  const symbol1 = Symbol();
  const obj1 = { [symbol1]: 1 };
  const obj2 = { [symbol1]: 1 };
  const obj3 = { [Symbol()]: 1 };
  const obj4 = { };
  Object.defineProperty(obj2, Symbol(), { value: 1 });
  Object.defineProperty(obj4, symbol1, { value: 1 });
  notUtilIsDeepStrict(obj1, obj3);
  utilIsDeepStrict(obj1, obj2);
  notUtilIsDeepStrict(obj1, obj4);
  const a = new Uint8Array(4);
  const b = new Uint8Array(4);
  a[symbol1] = true;
  b[symbol1] = false;
  notUtilIsDeepStrict(a, b);
  b[symbol1] = true;
  utilIsDeepStrict(a, b);
  const boxedStringA = new String('test');
  const boxedStringB = new String('test');
  boxedStringA[symbol1] = true;
  notUtilIsDeepStrict(boxedStringA, boxedStringB);
  boxedStringA[symbol1] = true;
  utilIsDeepStrict(a, b);
}
