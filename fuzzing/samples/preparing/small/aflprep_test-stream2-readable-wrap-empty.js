'use strict';
const { Readable } = require('stream');
const EE = require('events').EventEmitter;
const oldStream = new EE();
oldStream.pause = () => {};
oldStream.resume = () => {};
const newStream = new Readable().wrap(oldStream);
newStream
  .on('readable', () => {})
  .on('end', common.mustCall());
oldStream.emit('end');
