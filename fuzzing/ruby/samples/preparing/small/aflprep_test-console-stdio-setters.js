'use strict';
const { Writable } = require('stream');
const streamToNowhere = new Writable({ write: common.mustCall() });
const anotherStreamToNowhere = new Writable({ write: common.mustCall() });
console._stdout = streamToNowhere;
console._stderr = anotherStreamToNowhere;
console.log('fhqwhgads');
console.error('fhqwhgads');
