'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
new RuleTester({
  parserOptions: { ecmaVersion: 6 },
  env: { es6: true }
})
  .run('prefer-primordials', rule, {
    valid: [
      'new Array()',
      'JSON.stringify({})',
      'class A { *[Symbol.iterator] () { yield "a"; } }',
      'const a = { *[Symbol.iterator] () { yield "a"; } }',
      'Object.defineProperty(o, Symbol.toStringTag, { value: "o" })',
      'parseInt("10")',
      `
        const { Reflect } = primordials;
        module.exports = function() {
          const { ownKeys } = Reflect;
        }
      `,
      {
        code: 'const { Array } = primordials; new Array()',
        options: [{ name: 'Array' }]
      },
      {
        code: 'const { JSONStringify } = primordials; JSONStringify({})',
        options: [{ name: 'JSON' }]
      },
      {
        code: 'const { SymbolFor } = primordials; SymbolFor("xxx")',
        options: [{ name: 'Symbol' }]
      },
      {
        code: `
          const { SymbolIterator } = primordials;
          class A { *[SymbolIterator] () { yield "a"; } }
        `,
        options: [{ name: 'Symbol' }]
      },
      {
        code: `
          const { Symbol } = primordials;
          const a = { *[Symbol.iterator] () { yield "a"; } }
        `,
        options: [{ name: 'Symbol', ignore: ['iterator'] }]
      },
      {
        code: `
          const { ObjectDefineProperty, Symbol } = primordials;
          ObjectDefineProperty(o, Symbol.toStringTag, { value: "o" })
        `,
        options: [{ name: 'Symbol', ignore: ['toStringTag'] }]
      },
      {
        code: 'const { Symbol } = primordials; Symbol.for("xxx")',
        options: [{ name: 'Symbol', ignore: ['for'] }]
      },
      {
        code: 'const { NumberParseInt } = primordials; NumberParseInt("xxx")',
        options: [{ name: 'parseInt', into: 'Number' }]
      },
      {
        code: `
          const { ReflectOwnKeys } = primordials;
          module.exports = function() {
            ReflectOwnKeys({})
          }
        `,
        options: [{ name: 'Reflect' }],
      },
      {
        code: 'const { Map } = primordials; new Map()',
        options: [{ name: 'Map', into: 'Safe' }],
      },
      {
        code: `
          const { Function } = primordials;
          const rename = Function;
          const obj = { rename };
        `,
        options: [{ name: 'Function' }],
      },
      {
        code: `
          const { Function } = primordials;
          let rename;
          rename = Function;
          const obj = { rename };
        `,
        options: [{ name: 'Function' }],
      },
    ],
    invalid: [
      {
        code: 'new Array()',
        options: [{ name: 'Array' }],
      },
      {
        code: 'JSON.parse("{}")',
        options: [{ name: 'JSON' }],
        errors: [
        ]
      },
      {
        code: 'const { JSON } = primordials; JSON.parse("{}")',
        options: [{ name: 'JSON' }],
      },
      {
        code: 'Symbol.for("xxx")',
        options: [{ name: 'Symbol' }],
        errors: [
        ]
      },
      {
        code: 'const { Symbol } = primordials; Symbol.for("xxx")',
        options: [{ name: 'Symbol' }],
      },
      {
        code: `
          const { Symbol } = primordials;
          class A { *[Symbol.iterator] () { yield "a"; } }
        `,
        options: [{ name: 'Symbol' }],
      },
      {
        code: `
          const { Symbol } = primordials;
          const a = { *[Symbol.iterator] () { yield "a"; } }
        `,
        options: [{ name: 'Symbol' }],
      },
      {
        code: `
          const { ObjectDefineProperty, Symbol } = primordials;
          ObjectDefineProperty(o, Symbol.toStringTag, { value: "o" })
        `,
        options: [{ name: 'Symbol' }],
      },
      {
        code: `
          const { Number } = primordials;
          Number.parseInt('10')
        `,
        options: [{ name: 'Number' }],
      },
      {
        code: 'parseInt("10")',
        options: [{ name: 'parseInt', into: 'Number' }],
      },
      {
        code: `
          module.exports = function() {
            const { ownKeys } = Reflect;
          }
        `,
        options: [{ name: 'Reflect' }],
      },
      {
        code: `
          const { Reflect } = primordials;
          module.exports = function() {
            const { ownKeys } = Reflect;
          }
        `,
        options: [{ name: 'Reflect' }],
      },
      {
        code: 'new Map()',
        options: [{ name: 'Map', into: 'Safe' }],
      },
      {
        code: `
          const { Function } = primordials;
          const noop = Function.prototype;
        `,
        options: [{ name: 'Function' }],
      },
      {
        code: `
          const obj = { Function };
        `,
        options: [{ name: 'Function' }],
      },
      {
        code: `
          const rename = Function;
        `,
        options: [{ name: 'Function' }],
      },
      {
        code: `
          const rename = Function;
          const obj = { rename };
        `,
        options: [{ name: 'Function' }],
      },
      {
        code: `
          let rename;
          rename = Function;
          const obj = { rename };
        `,
        options: [{ name: 'Function' }],
      },
    ]
  });
