async function createWasmModule() {
  const response =
  const ab = await response.arrayBuffer();
  return WebAssembly.compile(ab);
}
