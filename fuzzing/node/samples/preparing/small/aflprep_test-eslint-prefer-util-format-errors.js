'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
new RuleTester({ parserOptions: { ecmaVersion: 6 } })
  .run('prefer-util-format-errors', rule, {
    valid: [
      'E(\'ABC\', \'abc\');',
      'E(\'ABC\', (arg1, arg2) => `${arg2}${arg1}`);',
      'E(\'ABC\', (arg1, arg2) => `${arg1}{arg2.something}`);',
      'E(\'ABC\', (arg1, arg2) => fn(arg1, arg2));',
    ],
    invalid: [
      {
        code: 'E(\'ABC\', (arg1, arg2) => `${arg1}${arg2}`);',
        errors: [{
          message: 'Please use a printf-like formatted string that ' +
                   'util.format can consume.'
        }]
      },
    ]
  });
