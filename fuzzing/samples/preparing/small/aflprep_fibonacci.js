'use strict';
function fib(n) {
  if (n === 0 || n === 1) return n;
  return fib(n - 1) + fib(n - 2);
}
const FIB = process.platform === 'win32' ? 40 : 30;
const n = parseInt(process.env.FIB) || FIB;
process.stdout.write(`${fib(n)}\n`);
