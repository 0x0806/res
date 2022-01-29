'use strict';
const assert = require('assert');
const util = require('util');
const processUtil = internalBinding('util');
const opts = { showProxy: true };
let proxyObj;
let called = false;
const target = {
  [util.inspect.custom](depth, { showProxy }) {
    if (showProxy === false) {
      called = true;
      if (proxyObj !== this) {
        throw new Error('Failed');
      }
    }
    return [1, 2, 3];
  }
};
const handler = {
  getPrototypeOf() { throw new Error('getPrototypeOf'); },
  setPrototypeOf() { throw new Error('setPrototypeOf'); },
  isExtensible() { throw new Error('isExtensible'); },
  preventExtensions() { throw new Error('preventExtensions'); },
  getOwnPropertyDescriptor() { throw new Error('getOwnPropertyDescriptor'); },
  defineProperty() { throw new Error('defineProperty'); },
  has() { throw new Error('has'); },
  get() { throw new Error('get'); },
  set() { throw new Error('set'); },
  deleteProperty() { throw new Error('deleteProperty'); },
  ownKeys() { throw new Error('ownKeys'); },
  apply() { throw new Error('apply'); },
  construct() { throw new Error('construct'); }
};
proxyObj = new Proxy(target, handler);
util.inspect(proxyObj, opts);
util.format('%s', proxyObj);
let details = processUtil.getProxyDetails(proxyObj, true);
assert.strictEqual(target, details[0]);
assert.strictEqual(handler, details[1]);
details = processUtil.getProxyDetails(proxyObj);
assert.strictEqual(target, details[0]);
assert.strictEqual(handler, details[1]);
details = processUtil.getProxyDetails(proxyObj, false);
assert.strictEqual(target, details);
assert.strictEqual(
  util.inspect(proxyObj, opts),
  'Proxy [\n' +
  '  [ 1, 2, 3 ],\n' +
  '  {\n' +
  '    getPrototypeOf: [Function: getPrototypeOf],\n' +
  '    setPrototypeOf: [Function: setPrototypeOf],\n' +
  '    isExtensible: [Function: isExtensible],\n' +
  '    preventExtensions: [Function: preventExtensions],\n' +
  '    getOwnPropertyDescriptor: [Function: getOwnPropertyDescriptor],\n' +
  '    defineProperty: [Function: defineProperty],\n' +
  '    has: [Function: has],\n' +
  '    get: [Function: get],\n' +
  '    set: [Function: set],\n' +
  '    deleteProperty: [Function: deleteProperty],\n' +
  '    ownKeys: [Function: ownKeys],\n' +
  '    apply: [Function: apply],\n' +
  '    construct: [Function: construct]\n' +
  '  }\n' +
  ']'
);
assert.strictEqual(processUtil.getProxyDetails({}), undefined);
assert.strictEqual(util.inspect(proxyObj), '[ 1, 2, 3 ]');
assert(called);
const proxy1 = new Proxy({}, {});
const proxy2 = new Proxy(proxy1, {});
const proxy3 = new Proxy(proxy2, proxy1);
const proxy4 = new Proxy(proxy1, proxy2);
const proxy5 = new Proxy(proxy3, proxy4);
const proxy6 = new Proxy(proxy5, proxy5);
const expected0 = '{}';
const expected1 = 'Proxy [ {}, {} ]';
const expected2 = 'Proxy [ Proxy [ {}, {} ], {} ]';
const expected3 = 'Proxy [ Proxy [ Proxy [ {}, {} ], {} ], Proxy [ {}, {} ] ]';
const expected4 = 'Proxy [ Proxy [ {}, {} ], Proxy [ Proxy [ {}, {} ], {} ] ]';
const expected5 = 'Proxy [\n  ' +
                  'Proxy [ Proxy [ Proxy [Array], {} ], Proxy [ {}, {} ] ],\n' +
                  '  Proxy [ Proxy [ {}, {} ], Proxy [ Proxy [Array], {} ] ]' +
                  '\n]';
const expected6 = 'Proxy [\n' +
                  '  Proxy [\n' +
                  '    Proxy [ Proxy [Array], Proxy [Array] ],\n' +
                  '    Proxy [ Proxy [Array], Proxy [Array] ]\n' +
                  '  ],\n' +
                  '  Proxy [\n' +
                  '    Proxy [ Proxy [Array], Proxy [Array] ],\n' +
                  '    Proxy [ Proxy [Array], Proxy [Array] ]\n' +
                  '  ]\n' +
                  ']';
assert.strictEqual(
  util.inspect(proxy1, { showProxy: 1, depth: null }),
  expected1);
assert.strictEqual(util.inspect(proxy2, opts), expected2);
assert.strictEqual(util.inspect(proxy3, opts), expected3);
assert.strictEqual(util.inspect(proxy4, opts), expected4);
assert.strictEqual(util.inspect(proxy5, opts), expected5);
assert.strictEqual(util.inspect(proxy6, opts), expected6);
assert.strictEqual(util.inspect(proxy1), expected0);
assert.strictEqual(util.inspect(proxy2), expected0);
assert.strictEqual(util.inspect(proxy3), expected0);
assert.strictEqual(util.inspect(proxy4), expected0);
assert.strictEqual(util.inspect(proxy5), expected0);
assert.strictEqual(util.inspect(proxy6), expected0);
const proxy7 = new Proxy([], []);
const expected7 = 'Proxy [ [], [] ]';
assert.strictEqual(util.inspect(proxy7, opts), expected7);
assert.strictEqual(util.inspect(proxy7), '[]');
const proxy8 = new Proxy(Date, []);
const proxy9 = new Proxy(Date, String);
const expected8 = 'Proxy [ [Function: Date], [] ]';
const expected9 = 'Proxy [ [Function: Date], [Function: String] ]';
assert.strictEqual(util.inspect(proxy8, opts), expected8);
assert.strictEqual(util.inspect(proxy9, opts), expected9);
assert.strictEqual(util.inspect(proxy8), '[Function: Date]');
assert.strictEqual(util.inspect(proxy9), '[Function: Date]');
const proxy10 = new Proxy(() => {}, {});
const proxy11 = new Proxy(() => {}, {
  get() {
    return proxy11;
  },
  apply() {
    return proxy11;
  }
});
const expected10 = '[Function (anonymous)]';
const expected11 = '[Function (anonymous)]';
assert.strictEqual(util.inspect(proxy10), expected10);
assert.strictEqual(util.inspect(proxy11), expected11);
