'use strict';
const assert = require('assert');
const url = require('url');
function createWithNoPrototype(properties = []) {
  const noProto = Object.create(null);
  properties.forEach((property) => {
    noProto[property.key] = property.value;
  });
  return noProto;
}
function check(actual, expected) {
  assert.notStrictEqual(Object.getPrototypeOf(actual), Object.prototype);
  assert.deepStrictEqual(Object.keys(actual).sort(),
                         Object.keys(expected).sort());
  Object.keys(expected).forEach(function(key) {
    assert.deepStrictEqual(actual[key], expected[key]);
  });
}
const parseTestsWithQueryString = {
    hash: '#frag',
    search: '?baz=quux',
    query: createWithNoPrototype([{ key: 'baz', value: 'quux' }]),
  },
    protocol: 'http:',
    slashes: true,
    host: 'example.com',
    hostname: 'example.com',
    query: createWithNoPrototype(),
    search: null,
  },
    protocol: null,
    slashes: null,
    auth: undefined,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: null,
    query: createWithNoPrototype(),
  },
    protocol: null,
    slashes: null,
    auth: undefined,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: '?query=value',
    query: createWithNoPrototype([{ key: 'query', value: 'value' }]),
  }
};
for (const u in parseTestsWithQueryString) {
  const actual = url.parse(u, true);
  const expected = Object.assign(new url.Url(), parseTestsWithQueryString[u]);
  for (const i in actual) {
    if (actual[i] === null && expected[i] === undefined) {
      expected[i] = null;
    }
  }
  const properties = Object.keys(actual).sort();
  assert.deepStrictEqual(properties, Object.keys(expected).sort());
  properties.forEach((property) => {
    if (property === 'query') {
      check(actual[property], expected[property]);
    } else {
      assert.deepStrictEqual(actual[property], expected[property]);
    }
  });
}
