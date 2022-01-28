'use strict';
process.on('warning', common.mustNotCall('A warning should not be emitted'));
Buffer.from('abc').map((i) => i);
Buffer.from('abc').filter((i) => i);
Buffer.from('abc').slice(1, 2);
