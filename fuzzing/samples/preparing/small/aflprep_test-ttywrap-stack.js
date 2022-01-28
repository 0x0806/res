'use strict';
const done = common.mustCall(() => {});
async function test() {
  await test();
}
(async () => {
  try {
    await test();
  } catch (err) {
    console.log(err);
  }
})().then(done, done);
