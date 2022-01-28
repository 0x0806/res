'use strict';
const ArrayIteratorPrototype =
    Object.getPrototypeOf(Array.prototype[Symbol.iterator]());
delete Array.prototype[Symbol.iterator];
delete ArrayIteratorPrototype.next;
