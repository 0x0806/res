'use strict';
process.on('warning', common.mustNotCall());
process.on('unhandledRejection', common.mustCall());
Promise.reject(new Error());
