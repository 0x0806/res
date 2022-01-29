'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
new RuleTester().run('no-duplicate-requires', rule, {
  valid: [
    {
      code: 'require("a"); require("b"); (function() { require("a"); });',
    },
    {
      code: 'require(a); require(a);',
    },
  ],
  invalid: [
    {
      code: 'require("a"); require("a");',
      errors: [{ message: '\'a\' require is duplicated.' }],
    },
  ],
});
