'use strict';
const assert = require('assert');
process.on('warning', common.mustCall((warning) => {
}, 2));
emitExperimentalWarning('feature1');
emitExperimentalWarning('feature2');
