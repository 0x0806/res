'use strict';
const { DeflateRaw } = require('zlib');
const { Readable } = require('stream');
function NotInitialized(options) {
  DeflateRaw.call(this, options);
  this.prop = true;
}
Object.setPrototypeOf(NotInitialized.prototype, DeflateRaw.prototype);
Object.setPrototypeOf(NotInitialized, DeflateRaw);
const dest = new NotInitialized();
const read = new Readable({
  read() {
    this.push(Buffer.from('a test string'));
    this.push(null);
  }
});
read.pipe(dest);
dest.resume();
