'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
new RuleTester().run('require-common-first', rule, {
  valid: [
    {
      code: 'require("common")\n' +
            'require("assert")'
    },
  ],
  invalid: [
    {
      code: 'require("assert")\n' +
            'require("common")',
      errors: [{ message: 'Mandatory module "common" must be loaded ' +
                          'before any other modules.' }]
    },
  ]
});
