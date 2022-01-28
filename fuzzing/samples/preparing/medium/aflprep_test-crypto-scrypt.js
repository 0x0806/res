'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
const assert = require('assert');
const crypto = require('crypto');
if (typeof internalBinding('crypto').ScryptJob !== 'function')
  common.skip('no scrypt support');
const good = [
  {
    pass: '',
    salt: '',
    keylen: 0,
    N: 16,
    p: 1,
    r: 1,
    expected: '',
  },
  {
    pass: '',
    salt: '',
    keylen: 64,
    N: 16,
    p: 1,
    r: 1,
    expected:
        '77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442' +
        'fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906',
  },
  {
    pass: 'password',
    salt: 'NaCl',
    keylen: 64,
    N: 1024,
    p: 16,
    r: 8,
    expected:
        'fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b373162' +
        '2eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640',
  },
  {
    pass: 'pleaseletmein',
    salt: 'SodiumChloride',
    keylen: 64,
    N: 16384,
    p: 1,
    r: 8,
    expected:
        '7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2' +
        'd5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887',
  },
  {
    pass: '',
    salt: '',
    keylen: 64,
    cost: 16,
    parallelization: 1,
    blockSize: 1,
    expected:
        '77d6576238657b203b19ca42c18a0497f16b4844e3074ae8dfdffa3fede21442' +
        'fcd0069ded0948f8326a753a0fc81f17e8d3e0fb2e0d3628cf35e20c38d18906',
  },
  {
    pass: 'password',
    salt: 'NaCl',
    keylen: 64,
    cost: 1024,
    parallelization: 16,
    blockSize: 8,
    expected:
        'fdbabe1c9d3472007856e7190d01e9fe7c6ad7cbc8237830e77376634b373162' +
        '2eaf30d92e22a3886ff109279d9830dac727afb94a83ee6d8360cbdfa2cc0640',
  },
  {
    pass: 'pleaseletmein',
    salt: 'SodiumChloride',
    keylen: 64,
    cost: 16384,
    parallelization: 1,
    blockSize: 8,
    expected:
        '7023bdcb3afd7348461c06cd81fd38ebfda8fbba904f8e3ea9b543f6545da1f2' +
        'd5432955613f0fcf62d49705242a9af9e61e85dc0d651e40dfcf017b45575887',
  },
];
const bad = [
];
const toobig = [
  { N: 2 ** 20, p: 1, r: 8 },
  { N: 2 ** 10, p: 1, r: 8, maxmem: 2 ** 20 },
];
const badargs = [
  {
    args: [],
  },
  {
    args: [null],
  },
  {
    args: [''],
  },
  {
    args: ['', null],
  },
  {
    args: ['', ''],
  },
  {
    args: ['', '', null],
  },
  {
    args: ['', '', .42],
  },
  {
    args: ['', '', -42],
  },
  {
    args: ['', '', 2147485780],
  },
];
for (const options of good) {
  const { pass, salt, keylen, expected } = options;
  const actual = crypto.scryptSync(pass, salt, keylen, options);
  assert.strictEqual(actual.toString('hex'), expected);
  crypto.scrypt(pass, salt, keylen, options, common.mustSucceed((actual) => {
    assert.strictEqual(actual.toString('hex'), expected);
  }));
}
for (const options of bad) {
  const expected = {
  };
  assert.throws(() => crypto.scrypt('pass', 'salt', 1, options, () => {}),
                expected);
  assert.throws(() => crypto.scryptSync('pass', 'salt', 1, options),
                expected);
}
for (const options of toobig) {
  const expected = {
  };
  assert.throws(() => crypto.scrypt('pass', 'salt', 1, options, () => {}),
                expected);
  assert.throws(() => crypto.scryptSync('pass', 'salt', 1, options),
                expected);
}
{
  const defaults = { N: 16384, p: 1, r: 8 };
  const expected = crypto.scryptSync('pass', 'salt', 1, defaults);
  const actual = crypto.scryptSync('pass', 'salt', 1);
  assert.deepStrictEqual(actual.toString('hex'), expected.toString('hex'));
  crypto.scrypt('pass', 'salt', 1, common.mustSucceed((actual) => {
    assert.deepStrictEqual(actual.toString('hex'), expected.toString('hex'));
  }));
}
{
  const defaultEncoding = crypto.DEFAULT_ENCODING;
  const defaults = { N: 16384, p: 1, r: 8 };
  const expected = crypto.scryptSync('pass', 'salt', 1, defaults);
  const testEncoding = 'latin1';
  crypto.DEFAULT_ENCODING = testEncoding;
  const actual = crypto.scryptSync('pass', 'salt', 1);
  assert.deepStrictEqual(actual, expected.toString(testEncoding));
  crypto.scrypt('pass', 'salt', 1, common.mustSucceed((actual) => {
    assert.deepStrictEqual(actual, expected.toString(testEncoding));
  }));
  crypto.DEFAULT_ENCODING = defaultEncoding;
}
for (const { args, expected } of badargs) {
  assert.throws(() => crypto.scrypt(...args), expected);
  assert.throws(() => crypto.scryptSync(...args), expected);
}
{
  const expected = { code: 'ERR_INVALID_CALLBACK' };
  assert.throws(() => crypto.scrypt('', '', 42, null), expected);
  assert.throws(() => crypto.scrypt('', '', 42, {}, null), expected);
  assert.throws(() => crypto.scrypt('', '', 42, {}), expected);
  assert.throws(() => crypto.scrypt('', '', 42, {}, {}), expected);
}
{
  crypto.scrypt('', '', 4, { maxmem: 2 ** 52 },
                common.mustSucceed((actual) => {
                  assert.strictEqual(actual.toString('hex'), 'd72c87d0');
                }));
  assert.throws(() => crypto.scryptSync('', '', 0, { maxmem: 2 ** 53 }), {
    code: 'ERR_OUT_OF_RANGE'
  });
}
{
  function testParameter(name, value) {
    let accessCount = 0;
    crypto.scryptSync('', '', 1, {
      get [name]() {
        accessCount++;
        return value;
      }
    });
    assert.throws(() => {
      crypto.scryptSync('', '', 1, {
        get [name]() {
          if (--accessCount === 0)
            return '';
          return value;
        }
      });
    }, {
      code: 'ERR_INVALID_ARG_TYPE'
    });
  }
  [
    ['N', 16384], ['cost', 16384],
    ['r', 8], ['blockSize', 8],
    ['p', 1], ['parallelization', 1],
  ].forEach((arg) => testParameter(...arg));
}
