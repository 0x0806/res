 * Transpiled with TypeScript from:
 *
 * export default 'the default';
 * export const name = 'name';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.default = 'the default';
exports.name = 'name';
Object.keys(_external).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _external[key];
    }
  });
});