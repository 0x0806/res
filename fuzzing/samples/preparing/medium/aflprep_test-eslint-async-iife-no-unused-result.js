'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
const message = 'The result of an immediately-invoked async function needs ' +
  'to be used (e.g. with `.then(common.mustCall())`)';
const tester = new RuleTester({ parserOptions: { ecmaVersion: 8 } });
tester.run('async-iife-no-unused-result', rule, {
  valid: [
    '(() => {})()',
    '(async () => {})',
    '(async () => {})().then()',
    '(async () => {})().catch()',
    '(function () {})()',
    '(async function () {})',
    '(async function () {})().then()',
    '(async function () {})().catch()',
  ],
  invalid: [
    {
      code: '(async () => {})()',
      errors: [{ message }],
      output: '(async () => {})()',
    },
    {
      code: '(async function() {})()',
      errors: [{ message }],
      output: '(async function() {})()',
    },
    {
      errors: [{ message }],
        '.then(common.mustCall())',
    },
    {
      errors: [{ message }],
        '.then(common.mustCall())',
    },
  ]
});
