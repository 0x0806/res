"use strict";
 * Run tests for window[propertyName] after discarding the browsing context, navigating, etc.
 * @param {string} propertyName
window.testIsPerWindow = propertyName => {
  test(t => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const frame = iframe.contentWindow;
    const before = frame[propertyName];
    assert_true(before !== undefined && before !== null, `window.${propertyName} must be implemented`);
    iframe.remove();
    const after = frame[propertyName];
    assert_equals(after, before, `window.${propertyName} should not change after iframe.remove()`);
  }, `Discarding the browsing context must not change window.${propertyName}`);
  async_test(t => {
    const iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const frame = iframe.contentWindow;
    const before = frame[propertyName];
    assert_true(before !== undefined && before !== null, `window.${propertyName} must be implemented`);
    iframe.onload = t.step_func(() => {
      if (frame.location.href === "about:blank") {
        return;
      }
      const after = frame[propertyName];
      assert_equals(after, before);
      t.done();
    });
  }, `Navigating from the initial about:blank must not replace window.${propertyName}`);
  async_test(t => {
    const iframe = document.createElement("iframe");
    iframe.onload = t.step_func_done(() => {
      const frame = iframe.contentWindow;
      const before = frame[propertyName];
      assert_true(before !== undefined && before !== null, `window.${propertyName} must be implemented`);
      frame.document.open();
      const after = frame[propertyName];
      assert_equals(after, before);
      frame.document.close();
    });
    document.body.appendChild(iframe);
  }, `document.open() must replace window.${propertyName}`);
};
