'use strict';
function dummy() {}
process.on('SIGINT', dummy);
process.on('exit', () => process.removeListener('SIGINT', dummy));
