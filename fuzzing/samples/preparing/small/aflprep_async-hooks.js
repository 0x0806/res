const async_hooks = require('async_hooks');
const hook = async_hooks.createHook({
  init: common.mustNotCall(),
  before: common.mustNotCall(),
  after: common.mustNotCall(),
  destroy: common.mustNotCall()
});
hook.enable();
