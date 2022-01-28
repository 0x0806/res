'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
new RuleTester().run('required-modules', rule, {
  valid: [
    {
      code: 'require("common")',
      options: [{ common: 'common' }]
    },
    {
      code: 'foo',
      options: []
    },
    {
      code: 'require("common")',
    },
    {
    },
  ],
  invalid: [
    {
      code: 'foo',
      options: [{ common: 'common' }],
      errors: [{ message: 'Mandatory module "common" must be loaded.' }]
    },
    {
      errors: [{
        message:
          'Mandatory module "common" must be loaded.'
      }]
    },
    {
      code: 'require("somethingElse")',
      options: [{ common: 'common' }],
      errors: [{ message: 'Mandatory module "common" must be loaded.' }]
    },
  ]
});
