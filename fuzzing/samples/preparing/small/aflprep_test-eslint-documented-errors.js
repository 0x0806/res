'use strict';
if (!common.hasCrypto)
  common.skip('missing crypto');
common.skipIfEslintMissing();
const invalidCode = 'UNDOCUMENTED ERROR CODE';
new RuleTester().run('documented-errors', rule, {
  valid: [
    `
      E('ERR_ASSERTION', 'foo');
    `,
  ],
  invalid: [
    {
      code: `
        E('${invalidCode}', 'bar');
      `,
      errors: [
        {
          line: 2
        },
        {
          message:
          line: 2
        },
      ]
    },
  ]
});
