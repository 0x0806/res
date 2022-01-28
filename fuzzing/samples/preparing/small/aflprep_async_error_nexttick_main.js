'use strict';
async function main() {
  try {
    await four();
  } catch (e) {
    console.error(e);
  }
}
process.nextTick(main);
