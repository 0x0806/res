'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
new RuleTester().run('no-unescaped-regexp-dot', rule, {
  valid: [
  ],
  invalid: [
    {
      errors: [{ message: 'Unescaped dot character in regular expression' }]
    },
    {
      errors: [{ message: 'Unescaped dot character in regular expression' }]
    },
  ]
});
