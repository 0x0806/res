'use strict';
if (!common.isMainThread)
  common.skip('Workers don\'t inherit per-env state like the check flag');
async_hooks.emitInit(-1, null, -1, {});
async_hooks.emitBefore(-1, -1);
async_hooks.emitAfter(-1);
async_hooks.emitDestroy(-1);
