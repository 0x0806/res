'use strict';
const fs = require('fs');
{
  const s = fs.createReadStream(__filename);
  s.close(common.mustCall());
  s.close(common.mustCall());
}
{
  const s = fs.createReadStream(__filename);
  s.destroy(null, common.mustCall());
  s.destroy(null, common.mustCall());
}
