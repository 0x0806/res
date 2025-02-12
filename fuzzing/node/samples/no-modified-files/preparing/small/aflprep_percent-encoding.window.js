function runTests(testUnits) {
  for (const testUnit of testUnits) {
    if (typeof testUnit === "string") {
      continue;
    }
    for (const encoding of Object.keys(testUnit.output)) {
      async_test(t => {
        const frame = document.body.appendChild(document.createElement("iframe"));
        t.add_cleanup(() => frame.remove());
        frame.onload = t.step_func_done(() => {
          const output = frame.contentDocument.querySelector("a");
          assert_equals(output.hash, `#${testUnit.output["utf-8"]}`, "fragment");
          assert_equals(output.search, `?${testUnit.output[encoding]}`, "query");
        });
      }, `Input ${testUnit.input} with encoding ${encoding}`);
    }
  }
}
function toBase64(input) {
  const bytes = new TextEncoder().encode(input);
  const byteString = Array.from(bytes, byte => String.fromCharCode(byte)).join("");
  const encoded = self.btoa(byteString);
  return encoded;
}
