'use strict';
const {
  expectWarning
const {
  _setSimultaneousAccepts
} = require('net');
expectWarning(
  'DeprecationWarning',
  'net._setSimultaneousAccepts() is deprecated and will be removed.',
  'DEP0121');
_setSimultaneousAccepts();
