'use strict';
console.error('before');
(function() {
	throw ({ foo: 'bar' });
})();
console.error('after');
