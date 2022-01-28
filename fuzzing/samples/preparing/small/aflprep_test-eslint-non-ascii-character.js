'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
new RuleTester().run('non-ascii-characters', rule, {
  valid: [
    {
      code: 'console.log("fhqwhgads")',
      options: []
    },
  ],
  invalid: [
    {
      code: 'console.log("μ")',
      options: [],
      errors: [{ message: "Non-ASCII character 'μ' detected." }],
    },
  ]
});
