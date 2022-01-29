if (global.maybe)
exports['invalid identifier'] = 'yes';
module.exports['?invalid'] = 'yes';
module.exports['π'] = 'yes';
exports['\u{D83C}'] = 'no';
exports['\u{D83C}\u{DF10}'] = 'yes';
Object.defineProperty(exports, 'z', { value: 'yes' });
