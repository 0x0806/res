'use strict';
const assert = require('assert');
const dgram = require('dgram');
const fork = require('child_process').fork;
const sock = dgram.createSocket('udp4');
const testNumber = parseInt(process.argv[2], 10);
const propertiesToTest = [
  '_handle',
  '_receiving',
  '_bindState',
  '_queue',
  '_reuseAddr',
];
const methodsToTest = [
  '_healthCheck',
  '_stopReceiving',
];
const propertyCases = propertiesToTest.map((propName) => {
  return [
    () => {
      common.expectWarning(
        'DeprecationWarning',
        `Socket.prototype.${propName} is deprecated`,
        'DEP0112'
      );
    },
    () => {
      common.expectWarning(
        'DeprecationWarning',
        `Socket.prototype.${propName} is deprecated`,
        'DEP0112'
      );
      sock[propName] = null;
    },
  ];
});
const methodCases = methodsToTest.map((propName) => {
  return () => {
    common.expectWarning(
      'DeprecationWarning',
      `Socket.prototype.${propName}() is deprecated`,
      'DEP0112'
    );
    sock[propName]();
  };
});
const cases = [].concat(
  ...propertyCases,
  ...methodCases
);
if (Number.isNaN(testNumber)) {
  const children = cases.map((_case, i) =>
    fork(process.argv[1], [ String(i) ]));
  children.forEach((child) => {
    child.on('close', (code) => {
      if (code > 0) {
        process.exit(code);
      }
    });
  });
  return;
}
assert.ok(cases[testNumber]);
cases[testNumber]();
