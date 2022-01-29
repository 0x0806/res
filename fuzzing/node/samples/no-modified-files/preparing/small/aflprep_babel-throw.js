esid: prod-OptionalExpression
features: [optional-chaining]
const obj = {
  a: {
    b: 22
  }
};
function fn() {
  return {};
}
setTimeout(err => {
  var _obj$a;
  if ((obj === null || obj === void 0 ? void 0 : (_obj$a = obj.a) === null || _obj$a === void 0 ? void 0 : _obj$a.b) === 22) throw Error('an exception');
}, 5);
