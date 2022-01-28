const { spawnSync } = require('child_process');
const env = { ...process.env };
delete env.NODE_V8_COVERAGE
  env: env
});
