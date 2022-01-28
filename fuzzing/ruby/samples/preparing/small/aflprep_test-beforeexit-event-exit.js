'use strict';
process.on('beforeExit', mustNotCall('exit should not allow this to occur'));
process.exit();
